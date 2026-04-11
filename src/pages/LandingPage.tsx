import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, GitBranch, Brain, FileText, ArrowRight, Activity } from "lucide-react";
import { GradientButton } from "@/components/GradientButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import CountUp from "react-countup";

const features = [
  { icon: GitBranch, title: "Fund Flow Tracing", desc: "Track end-to-end money movement across accounts with interactive graph visualization" },
  { icon: ShieldAlert, title: "Fraud Detection", desc: "AI-powered detection of circular transactions, layering, and structuring patterns" },
  { icon: Brain, title: "AI Copilot", desc: "Intelligent assistant that explains fraud patterns and guides investigations" },
  { icon: FileText, title: "FIU Reports", desc: "Generate compliant investigation reports ready for regulatory submission" },
];

const stats = [
  { value: 2.4, suffix: "M+", label: "Transactions Monitored" },
  { value: 99.7, suffix: "%", label: "Detection Accuracy" },
  { value: 150, suffix: "+", label: "Banks Connected" },
  { value: 45, suffix: "ms", label: "Avg Response Time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">Fund Flow Guardian</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth">
            <GradientButton size="sm">Enter Dashboard</GradientButton>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium"
          >
            <Activity className="w-4 h-4" />
            <span>AI-Powered Financial Intelligence</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Intelligent</span>{" "}
            <span className="text-gradient-primary">Fund Flow</span>
            <br />
            <span className="text-foreground">Monitoring</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track, visualize, and analyze fund movement across accounts using graph analytics
            and AI-based fraud detection. Built for financial investigators.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <GradientButton size="lg">
                <span className="flex items-center gap-2">
                  Launch Platform <ArrowRight className="w-5 h-5" />
                </span>
              </GradientButton>
            </Link>
            <Link to="/fund-flow">
              <motion.button
                className="px-8 py-4 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                View Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-primary">
                <CountUp end={s.value} duration={2.5} decimals={s.value % 1 ? 1 : 0} />
                {s.suffix}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-16"
        >
          Everything You Need to
          <span className="text-gradient-primary"> Investigate</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AnimatedCard glass gradientBorder className="h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 AI Fund Flow Guardian. Built for financial intelligence.</p>
      </footer>
    </div>
  );
}
