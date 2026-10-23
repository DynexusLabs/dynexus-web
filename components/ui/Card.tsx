import { clsx } from "clsx";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : undefined}
      className={clsx(
        "bg-white/10 dark:bg-dark-200/50 backdrop-blur-md border border-white/20 dark:border-gray-600/30",
        "rounded-xl p-6 shadow-xl",
        glow && "shadow-primary-500/20 animate-glow",
        hover && "transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
