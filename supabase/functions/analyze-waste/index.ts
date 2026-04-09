import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert waste classification AI. Analyze the image of waste/garbage and return a JSON response with the following structure:
{
  "items": [
    {
      "name": "string - name of the item detected",
      "material": "plastic" | "metal" | "paper" | "glass" | "organic" | "e-waste" | "textile" | "mixed",
      "confidence": number between 0 and 1,
      "recyclable": boolean,
      "reuse_suggestions": ["string array of creative reuse ideas"],
      "estimated_value_usd_per_kg": number
    }
  ],
  "summary": {
    "total_items": number,
    "recyclable_count": number,
    "co2_saved_kg": number (estimated CO2 saved if all recyclable items are recycled),
    "landfill_reduction_kg": number (estimated weight diverted from landfill),
    "energy_saved_kwh": number (estimated energy saved through recycling),
    "overall_recyclability_percent": number
  },
  "lifestyle_tips": ["string array of 2-3 tips to reduce this type of waste"]
}

Be thorough in detection. Estimate realistic values. If the image doesn't contain waste, return items as empty array with a note in lifestyle_tips.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this waste image and classify all materials detected." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { items: [], summary: { total_items: 0, recyclable_count: 0, co2_saved_kg: 0, landfill_reduction_kg: 0, energy_saved_kwh: 0, overall_recyclability_percent: 0 }, lifestyle_tips: ["Could not parse AI response. Please try again."] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
