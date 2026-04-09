import { AnalysisResult } from "@/lib/waste-api";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

const COLORS = [
  "hsl(199, 89%, 48%)", // sky - plastic
  "hsl(220, 13%, 60%)", // gray - metal
  "hsl(38, 92%, 50%)",  // amber - paper
  "hsl(142, 50%, 42%)", // leaf - glass
  "hsl(152, 45%, 28%)", // emerald - organic
  "hsl(12, 76%, 61%)",  // coral - e-waste
  "hsl(270, 50%, 60%)", // purple - textile
  "hsl(0, 0%, 60%)",    // gray - mixed
];

interface WasteChartsProps {
  results: AnalysisResult[];
}

export function WasteCharts({ results }: WasteChartsProps) {
  // Aggregate materials across all analyses
  const materialCounts: Record<string, number> = {};
  results.forEach((r) => {
    r.items.forEach((item) => {
      materialCounts[item.material] = (materialCounts[item.material] || 0) + 1;
    });
  });

  const pieData = Object.entries(materialCounts).map(([name, value]) => ({ name, value }));

  const impactData = results.map((r, i) => ({
    name: `Scan ${i + 1}`,
    co2: r.summary.co2_saved_kg,
    energy: r.summary.energy_saved_kwh,
    landfill: r.summary.landfill_reduction_kg,
  }));

  if (results.length === 0) {
    return (
      <Card className="p-8 shadow-card border-0 bg-card text-center">
        <p className="text-muted-foreground">Upload and analyze waste images to see your sustainability dashboard here.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5 shadow-card border-0 bg-card">
        <h3 className="font-display text-base font-semibold text-foreground mb-4">Material Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5 shadow-card border-0 bg-card">
        <h3 className="font-display text-base font-semibold text-foreground mb-4">Impact per Scan</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={impactData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="co2" name="CO₂ (kg)" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="energy" name="Energy (kWh)" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
