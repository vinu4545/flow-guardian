import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { staggerContainer, staggerItem, pageTransition } from "@/lib/animations";
import { CounterStat } from "@/components/CounterStat";
import { RiskBadge } from "@/components/RiskBadge";
import { AnimatedCard } from "@/components/AnimatedCard";
import { dashboardStats, riskDistribution, transactionVolume, recentAlerts } from "@/lib/mockData";
import { apiService, type Alert } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Bell, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Update dashboard stats with real data
  const updatedStats = dashboardStats.map(stat => {
    if (stat.label === "Flagged Alerts" && alerts.length > 0) {
      return { ...stat, value: alerts.length };
    }
    return stat;
  });

  // Format alerts for display
  const formatAlertForDisplay = (alert: Alert) => {
    // Extract account from description if possible
    const accountMatch = alert.description.match(/ACC\d+/);
    const account = accountMatch ? accountMatch[0] : 'N/A';

    // Calculate time ago
    const createdAt = new Date(alert.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    let timeAgo;
    if (diffMins < 1) {
      timeAgo = 'Just now';
    } else if (diffMins < 60) {
      timeAgo = `${diffMins} min ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    return {
      id: `ALT-${alert.id.toString().padStart(4, '0')}`,
      type: alert.type.charAt(0).toUpperCase() + alert.type.slice(1),
      account,
      risk: alert.severity,
      time: timeAgo,
      amount: 'N/A', // Backend doesn't provide amounts yet
    };
  };

  const displayAlerts = alerts.length > 0 ? alerts.slice(0, 5).map(formatAlertForDisplay) : recentAlerts;

  return (
    <motion.div {...pageTransition} className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time financial monitoring overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last updated: Just now</span>
          </div>
          <Button
            onClick={fetchAlerts}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {updatedStats.map((s) => (
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading alerts...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts detected yet. Run fraud detection to identify suspicious patterns.
            </div>
          ) : (
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
                {displayAlerts.map((alert, i) => (
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
          )}
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
