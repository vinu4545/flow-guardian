import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { hoverLift } from "@/lib/animations";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glass?: boolean;
  gradientBorder?: boolean;
  neonGlow?: boolean;
}

export function AnimatedCard({
  children,
  glass = true,
  gradientBorder = false,
  neonGlow = false,
  className = "",
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      {...hoverLift}
      className={`
        p-6 rounded-xl transition-shadow duration-300
        ${glass ? "glass-card" : "bg-card border border-border"}
        ${gradientBorder ? "gradient-border" : ""}
        ${neonGlow ? "neon-glow" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
