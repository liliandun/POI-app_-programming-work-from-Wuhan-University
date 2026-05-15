"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  padding = "p-7",
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        rounded-[28px] border border-[rgba(249,219,154,0.18)]
        bg-[linear-gradient(180deg,rgba(68,43,21,0.58),rgba(20,13,8,0.42))]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.45),0_0_48px_rgba(246,115,0,0.08)]
        backdrop-blur-[18px]
        ${hover ? "transition-all duration-220" : ""}
        ${padding} ${className}
      `}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: "rgba(249, 219, 154, 0.34)",
              background:
                "linear-gradient(180deg, rgba(88, 52, 22, 0.62), rgba(30, 18, 8, 0.48))",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
