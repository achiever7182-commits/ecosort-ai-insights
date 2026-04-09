import { AnalysisResult } from "@/lib/waste-api";
import { Leaf, Zap, Trash2, DollarSign, Recycle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const materialColors: Record<string, string> = {
  plastic: "bg-eco-sky/15 text-eco-sky border-eco-sky/30",
  metal: "bg-muted text-muted-foreground border-border",
  paper: "bg-eco-amber/15 text-eco-amber border-eco-amber/30",
  glass: "bg-eco-leaf/15 text-eco-leaf border-eco-leaf/30",
  organic: "bg-primary/10 text-primary border-primary/30",
  "e-waste": "bg-eco-coral/15 text-eco-coral border-eco-coral/30",
  textile: "bg-accent/15 text-accent border-accent/30",
  mixed: "bg-muted text-muted-foreground border-border",
};

const materialIcons: Record<string, string> = {
  plastic: "♻️",
  metal: "🔩",
  paper: "📄",
  glass: "🪟",
  organic: "🌿",
  "e-waste": "💻",
  textile: "👕",
  mixed: "🗑️",
};

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const { items, summary, lifestyle_tips } = result;

  return (
    <div className="space-y-6">
      {/* Impact Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">CO₂ Saved</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{summary.co2_saved_kg.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> kg</span></p>
        </Card>
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Trash2 className="h-4 w-4 text-eco-coral" />
            <span className="text-xs font-medium">Landfill ↓</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{summary.landfill_reduction_kg.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> kg</span></p>
        </Card>
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="h-4 w-4 text-eco-amber" />
            <span className="text-xs font-medium">Energy Saved</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{summary.energy_saved_kwh.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> kWh</span></p>
        </Card>
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Recycle className="h-4 w-4 text-eco-leaf" />
            <span className="text-xs font-medium">Recyclable</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{summary.overall_recyclability_percent}<span className="text-sm font-normal text-muted-foreground">%</span></p>
        </Card>
      </div>

      {/* Detected Items */}
      {items.length > 0 && (
        <Card className="p-5 shadow-card border-0 bg-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Detected Materials</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-background p-3">
                <span className="text-2xl">{materialIcons[item.material] || "🗑️"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <Badge variant="outline" className={materialColors[item.material] || ""}>
                      {item.material}
                    </Badge>
                    {item.recyclable && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">♻️ Recyclable</Badge>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={item.confidence * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                  {item.estimated_value_usd_per_kg > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>${item.estimated_value_usd_per_kg.toFixed(2)}/kg recycling value</span>
                    </div>
                  )}
                  {item.reuse_suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.reuse_suggestions.slice(0, 3).map((s, j) => (
                        <span key={j} className="inline-block rounded-lg bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          💡 {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lifestyle Tips */}
      {lifestyle_tips.length > 0 && (
        <Card className="p-5 shadow-card border-0 gradient-eco">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
            <h3 className="font-display text-lg font-semibold text-primary-foreground">Sustainability Tips</h3>
          </div>
          <ul className="space-y-2">
            {lifestyle_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary-foreground/90">
                <span className="mt-0.5">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
