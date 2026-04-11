import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const gradients = {
  primary: "from-[hsl(var(--primary))] to-[hsl(239,84%,55%)]",
  secondary: "from-[hsl(var(--secondary))] to-[hsl(187,92%,50%)]",
  accent: "from-[hsl(var(--accent))] to-[hsl(330,81%,50%)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function GradientButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: GradientButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        bg-gradient-to-r ${gradients[variant]} ${sizes[size]}
        text-primary-foreground font-semibold rounded-lg
        shadow-lg hover:shadow-xl transition-shadow
        ${className}
      `}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
