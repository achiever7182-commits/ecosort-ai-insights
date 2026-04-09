import { Loader2, Leaf, ScanSearch } from "lucide-react";

const steps = [
  "Scanning image for waste materials...",
  "Classifying detected objects...",
  "Calculating sustainability impact...",
  "Generating reuse suggestions...",
];

export function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative">
        <div className="h-20 w-20 rounded-2xl gradient-eco flex items-center justify-center animate-pulse">
          <ScanSearch className="h-10 w-10 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card shadow-card flex items-center justify-center">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground">Analyzing Waste</h3>
        <div className="space-y-1">
          {steps.map((step, i) => (
            <p key={i} className="text-sm text-muted-foreground animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
              {step}
            </p>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Leaf className="h-3 w-3 text-primary" />
        <span>Powered by SmartSort AI</span>
      </div>
    </div>
  );
}
