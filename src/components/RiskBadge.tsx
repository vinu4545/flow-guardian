import { motion } from "framer-motion";

interface RiskBadgeProps {
  risk: "low" | "medium" | "high";
  pulse?: boolean;
}

const riskStyles = {
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
};

export function RiskBadge({ risk, pulse = false }: RiskBadgeProps) {
  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
        ${riskStyles[risk]}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${risk === "high" ? "bg-destructive" : risk === "medium" ? "bg-warning" : "bg-success"}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${risk === "high" ? "bg-destructive" : risk === "medium" ? "bg-warning" : "bg-success"}`} />
        </span>
      )}
      {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </motion.span>
  );
}
