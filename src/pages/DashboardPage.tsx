import { motion } from "framer-motion";
import { staggerContainer, staggerItem, pageTransition } from "@/lib/animations";
import { CounterStat } from "@/components/CounterStat";
import { RiskBadge } from "@/components/RiskBadge";
import { AnimatedCard } from "@/components/AnimatedCard";
import { dashboardStats, riskDistribution, recentAlerts, transactionVolume } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Bell, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <motion.div {...pageTransition} className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time financial monitoring overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((s) => (
          <CounterStat key={s.label} {...s} />
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transaction Volume */}
        <AnimatedCard className="lg:col-span-2">
          <h3 className="font-display font-semibold text-foreground mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={transactionVolume}>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="legitimate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="suspicious" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnimatedCard>

        {/* Risk Distribution */}
        <AnimatedCard>
          <h3 className="font-display font-semibold text-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                {r.name}
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Alerts */}
      <AnimatedCard>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Recent Alerts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Alert ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Account</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Risk</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((alert, i) => (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 font-mono text-xs text-foreground">{alert.id}</td>
                  <td className="py-3 text-foreground">{alert.type}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{alert.account}</td>
                  <td className="py-3 text-foreground font-medium">{alert.amount}</td>
                  <td className="py-3"><RiskBadge risk={alert.risk as "low" | "medium" | "high"} pulse={alert.risk === "high"} /></td>
                  <td className="py-3 text-muted-foreground">{alert.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
