import { motion } from "framer-motion";
import { useState } from "react";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { RiskBadge } from "@/components/RiskBadge";
import { fraudPatterns } from "@/lib/mockData";
import { apiService, type DetectionResult } from "@/lib/api";
import { AlertTriangle, TrendingUp, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FraudDetectionPage() {
  const [circularResult, setCircularResult] = useState<DetectionResult | null>(null);
  const [layeringResult, setLayeringResult] = useState<DetectionResult | null>(null);
  const [loadingCircular, setLoadingCircular] = useState(false);
  const [loadingLayering, setLoadingLayering] = useState(false);

  const runCircularDetection = async () => {
    setLoadingCircular(true);
    try {
      const result = await apiService.detectCircular();
      setCircularResult(result);
      toast.success(`Found ${result.cycles_found} circular patterns`);
    } catch (error) {
      toast.error("Failed to run circular detection");
      console.error(error);
    } finally {
      setLoadingCircular(false);
    }
  };

  const runLayeringDetection = async () => {
    setLoadingLayering(true);
    try {
      const result = await apiService.detectLayering();
      setLayeringResult(result);
      toast.success(`Found ${result.count} layering patterns`);
    } catch (error) {
      toast.error("Failed to run layering detection");
      console.error(error);
    } finally {
      setLoadingLayering(false);
    }
  };

  // Update fraud patterns with real data
  const updatedFraudPatterns = fraudPatterns.map(pattern => {
    if (pattern.id === 'circular' && circularResult) {
      return { ...pattern, detected: circularResult.cycles_found || 0 };
    }
    if (pattern.id === 'layering' && layeringResult) {
      return { ...pattern, detected: layeringResult.count || 0 };
    }
    return pattern;
  });

  return (
    <motion.div {...pageTransition} className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Fraud Detection</h1>
        <p className="text-sm text-muted-foreground">AI-powered pattern recognition and anomaly detection</p>
      </div>

      {/* Pattern Cards */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {updatedFraudPatterns.map((p) => (
          <motion.div key={p.id} variants={staggerItem}>
            <AnimatedCard gradientBorder={p.risk === "high"} neonGlow={p.risk === "high"} className="h-full">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-display font-semibold text-foreground text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-foreground">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">{p.detected}</span>
                  <span className="text-xs text-muted-foreground">detected</span>
                </div>
                <RiskBadge risk={p.risk} pulse />
              </div>
              {/* Detection Button */}
              <div className="mt-4">
                {p.id === 'circular' && (
                  <Button
                    onClick={runCircularDetection}
                    disabled={loadingCircular}
                    size="sm"
                    className="w-full"
                    variant="outline"
                  >
                    {loadingCircular ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run Detection
                  </Button>
                )}
                {p.id === 'layering' && (
                  <Button
                    onClick={runLayeringDetection}
                    disabled={loadingLayering}
                    size="sm"
                    className="w-full"
                    variant="outline"
                  >
                    {loadingLayering ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run Detection
                  </Button>
                )}
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Detection Results */}
      {(circularResult || layeringResult) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Circular Detection Results */}
          {circularResult && (
            <AnimatedCard>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-display font-semibold text-foreground">Circular Detection Results</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Cycles Found</span>
                  <span className="text-lg font-bold text-destructive">{circularResult.cycles_found}</span>
                </div>
                {circularResult.cycles && circularResult.cycles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Detected Cycles:</h4>
                    {circularResult.cycles.map((cycle, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded border-l-4 border-destructive">
                        <div className="font-mono text-sm text-foreground">
                          {cycle.join(" → ")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedCard>
          )}

          {/* Layering Detection Results */}
          {layeringResult && (
            <AnimatedCard>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-warning" />
                <h3 className="font-display font-semibold text-foreground">Layering Detection Results</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Paths Found</span>
                  <span className="text-lg font-bold text-warning">{layeringResult.count}</span>
                </div>
                {layeringResult.paths && layeringResult.paths.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <h4 className="text-sm font-medium text-muted-foreground">Detected Paths:</h4>
                    {layeringResult.paths.slice(0, 5).map((path, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded border-l-4 border-warning">
                        <div className="font-mono text-sm text-foreground">
                          {path.join(" → ")}
                        </div>
                      </div>
                    ))}
                    {layeringResult.paths.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        ... and {layeringResult.paths.length - 5} more paths
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AnimatedCard>
          )}
        </div>
      )}

      {/* Timeline */}
      <AnimatedCard>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Detection Timeline</h3>
        </div>
        <div className="relative pl-8 space-y-6">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
          {[
            { time: "14:23", event: "Circular flow detected: ACC-9281 → ACC-7712 → ACC-3384 → ACC-9281", risk: "high" as const },
            { time: "14:18", event: "Structuring alert: 5 transactions below $10K threshold from ACC-7712", risk: "high" as const },
            { time: "13:55", event: "Layering pattern: rapid multi-hop transfer through 4 intermediaries", risk: "medium" as const },
            { time: "13:42", event: "Dormant account ACC-5519 activated after 18 months of inactivity", risk: "medium" as const },
            { time: "13:15", event: "Unusual volume spike: ACC-1193 received 12x normal transaction volume", risk: "low" as const },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-4"
            >
              <div className={`absolute -left-5 w-3 h-3 rounded-full mt-1.5 ${
                item.risk === "high" ? "bg-destructive" : item.risk === "medium" ? "bg-warning" : "bg-success"
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{item.time}</span>
                  <RiskBadge risk={item.risk} />
                </div>
                <p className="text-sm text-foreground">{item.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
