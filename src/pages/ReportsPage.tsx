import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { GradientButton } from "@/components/GradientButton";
import { FileText, Download, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

const reports = [
  { id: "RPT-2024-034", title: "Circular Flow Investigation — Shell Corp Network", date: "Mar 16, 2024", status: "completed", pages: 24 },
  { id: "RPT-2024-033", title: "Structuring Analysis — Below Threshold Deposits", date: "Mar 15, 2024", status: "completed", pages: 18 },
  { id: "RPT-2024-032", title: "Dormant Account Activation Report", date: "Mar 14, 2024", status: "completed", pages: 12 },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setGenerating(false); return 100; }
        return p + 5;
      });
    }, 100);
  };

  return (
    <motion.div {...pageTransition} className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">FIU Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and manage FIU-compliant investigation reports</p>
        </div>
        <GradientButton onClick={handleGenerate} size="sm">
          <span className="flex items-center gap-2">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Report
          </span>
        </GradientButton>
      </div>

      {/* Progress */}
      {generating && (
        <AnimatedCard gradientBorder>
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground mb-2">Generating FIU Report...</div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{progress}% — Analyzing transaction chains...</div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Report Template */}
      <AnimatedCard className="space-y-3">
        <h3 className="font-display font-semibold text-foreground">Report Sections</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["Executive Summary", "Accounts Involved", "Transaction Chain", "Fraud Pattern Detected", "Risk Assessment", "Timeline of Events", "Evidence Attachments", "Recommended Actions"].map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-foreground"
            >
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              {s}
            </motion.div>
          ))}
        </div>
      </AnimatedCard>

      {/* Past Reports */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        <h3 className="font-display font-semibold text-foreground">Generated Reports</h3>
        {reports.map((r) => (
          <motion.div key={r.id} variants={staggerItem}>
            <AnimatedCard className="flex items-center gap-4">
              <div className="w-12 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary">{r.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Completed</span>
                </div>
                <h4 className="font-medium text-foreground text-sm truncate">{r.title}</h4>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date}</span>
                  <span>{r.pages} pages</span>
                </div>
              </div>
              <motion.button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download className="w-4 h-4" /> PDF
              </motion.button>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
