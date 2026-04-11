import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { RiskBadge } from "@/components/RiskBadge";
import { GradientButton } from "@/components/GradientButton";
import { Search, User, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const cases = [
  {
    id: "CASE-2024-089",
    title: "Circular Fund Flow — Shell Corp Network",
    status: "active",
    risk: "high" as const,
    assignee: "Agent K. Sharma",
    accounts: 6,
    transactions: 24,
    lastUpdate: "2 hours ago",
  },
  {
    id: "CASE-2024-088",
    title: "Structuring Pattern — Below Threshold Deposits",
    status: "active",
    risk: "high" as const,
    assignee: "Agent R. Patel",
    accounts: 3,
    transactions: 15,
    lastUpdate: "5 hours ago",
  },
  {
    id: "CASE-2024-087",
    title: "Dormant Account Activation — Suspicious Inflow",
    status: "review",
    risk: "medium" as const,
    assignee: "Agent M. Singh",
    accounts: 2,
    transactions: 8,
    lastUpdate: "1 day ago",
  },
];

export default function InvestigationPage() {
  return (
    <motion.div {...pageTransition} className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Investigation Panel</h1>
          <p className="text-sm text-muted-foreground">Active cases and investigation workflows</p>
        </div>
        <GradientButton size="sm">
          <span className="flex items-center gap-2"><Search className="w-4 h-4" /> New Case</span>
        </GradientButton>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        {cases.map((c) => (
          <motion.div key={c.id} variants={staggerItem}>
            <AnimatedCard className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">{c.id}</span>
                  <RiskBadge risk={c.risk} pulse />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {c.status === "active" ? "Active" : "Under Review"}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{c.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.assignee}</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{c.accounts} accounts</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{c.transactions} transactions</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.lastUpdate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Details
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Investigate
                </motion.button>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Case Timeline */}
      <AnimatedCard>
        <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Case Timeline — {cases[0].id}
        </h3>
        <div className="relative pl-8 space-y-5">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
          {[
            { time: "Today 14:23", label: "Circular flow flagged by AI engine", icon: "🔴" },
            { time: "Today 14:25", label: "Case auto-created and assigned to Agent K. Sharma", icon: "📋" },
            { time: "Today 14:30", label: "6 related accounts identified via graph analysis", icon: "🔗" },
            { time: "Today 14:45", label: "24 suspicious transactions linked to case", icon: "💸" },
            { time: "Today 15:00", label: "Investigation in progress — pending report generation", icon: "🔍" },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <div className="absolute -left-[1.6rem] text-lg">{step.icon}</div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">{step.time}</span>
                <p className="text-sm text-foreground mt-0.5">{step.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
