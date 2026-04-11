export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 300, damping: 25 },
};

export const slideInRight = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

export const slideInLeft = {
  initial: { x: -30, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const springBounce = {
  type: "spring" as const,
  stiffness: 400,
  damping: 20,
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
};
