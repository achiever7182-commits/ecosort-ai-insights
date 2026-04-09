import { useState, useCallback } from "react";
import { Recycle, BarChart3, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { WasteCharts } from "@/components/WasteCharts";
import { analyzeWasteImage, AnalysisResult } from "@/lib/waste-api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [allResults, setAllResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const { toast } = useToast();

  const handleImageSelected = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    setCurrentResult(null);
    try {
      const result = await analyzeWasteImage(base64);
      setCurrentResult(result);
      setAllResults((prev) => [...prev, result]);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: e.message || "Could not analyze the image. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-eco flex items-center justify-center">
              <Recycle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground leading-tight">SmartSort AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Waste Segregation</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">SDG 11 · 12 · 13</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-8 pb-4">
        <div className="text-center space-y-3 mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Turn Waste Into <span className="text-primary">Wisdom</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload a photo of waste and our AI instantly identifies recyclable materials, calculates environmental impact, and suggests sustainable actions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2">
            <TabsTrigger value="scan" className="gap-2">
              <Recycle className="h-4 w-4" />
              Scan Waste
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <ImageUpload onImageSelected={handleImageSelected} isAnalyzing={isAnalyzing} />

            {isAnalyzing && <AnalysisLoader />}

            {!isAnalyzing && currentResult && <AnalysisResults result={currentResult} />}

            {!isAnalyzing && !currentResult && (
              <div className="text-center py-12 space-y-3">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Recycle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Upload a waste image to get started</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <WasteCharts results={allResults} />

            {allResults.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl gradient-eco p-5 text-center">
                  <p className="text-3xl font-display font-bold text-primary-foreground">
                    {allResults.reduce((sum, r) => sum + r.summary.co2_saved_kg, 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-primary-foreground/80 mt-1">Total CO₂ Saved (kg)</p>
                </div>
                <div className="rounded-2xl bg-eco-amber/15 p-5 text-center">
                  <p className="text-3xl font-display font-bold text-foreground">
                    {allResults.reduce((sum, r) => sum + r.summary.energy_saved_kwh, 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total Energy Saved (kWh)</p>
                </div>
                <div className="rounded-2xl bg-eco-sky/15 p-5 text-center">
                  <p className="text-3xl font-display font-bold text-foreground">
                    {allResults.reduce((sum, r) => sum + r.items.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Items Analyzed</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>SmartSort AI — Aligned with UN SDG 11, 12 & 13 🌍</p>
      </footer>
    </div>
  );
};

export default Index;
