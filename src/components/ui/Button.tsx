"use client";

import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variants = {
  primary:
    "bg-white text-[#100900] shadow-[0_12px_40px_rgba(255,255,255,0.12)] hover:shadow-[0_16px_48px_rgba(255,255,255,0.18)]",
  secondary:
    "bg-white/[0.03] text-white/80 border border-white/20 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/30",
  ghost:
    "bg-transparent text-white/60 hover:text-white/90 hover:bg-white/[0.05]",
  danger:
    "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30",
};

const sizes = {
  sm: "h-10 px-4 text-sm rounded-xl",
  md: "h-12 px-6 text-sm rounded-2xl",
  lg: "h-14 px-8 text-sm rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
