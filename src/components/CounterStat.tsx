import CountUp from "react-countup";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CounterStatProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  sparkline?: number[];
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CounterStat({ label, value, prefix = "", suffix = "", change, sparkline }: CounterStatProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      variants={staggerItem}
      className="glass-card p-5 rounded-xl flex flex-col gap-2"
    >
      <span className="text-sm text-muted-foreground font-body">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-display font-bold text-foreground">
          {prefix}
          <CountUp end={value} duration={2} separator="," />
          {suffix}
        </span>
        {sparkline && <MiniSparkline data={sparkline} />}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{Math.abs(change)}%</span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
