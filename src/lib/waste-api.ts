import { supabase } from "@/integrations/supabase/client";

export interface WasteItem {
  name: string;
  material: string;
  confidence: number;
  recyclable: boolean;
  reuse_suggestions: string[];
  estimated_value_usd_per_kg: number;
}

export interface WasteSummary {
  total_items: number;
  recyclable_count: number;
  co2_saved_kg: number;
  landfill_reduction_kg: number;
  energy_saved_kwh: number;
  overall_recyclability_percent: number;
}

export interface AnalysisResult {
  items: WasteItem[];
  summary: WasteSummary;
  lifestyle_tips: string[];
}

export async function analyzeWasteImage(imageBase64: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-waste", {
    body: { imageBase64 },
  });

  if (error) throw new Error(error.message || "Analysis failed");
  return data as AnalysisResult;
}
