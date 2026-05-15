"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const navItems = [
  { label: "首页", href: "/" },
  { label: "功能", href: "#features" },
  { label: "关于", href: "#about" },
];

export default function Header() {
  return (
    <motion.header
      className="fixed left-6 right-6 top-6 z-20 flex items-center justify-between md:left-18 md:right-18"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 font-semibold">
        <div className="h-9 w-9 rounded-xl bg-[#AB59D7] shadow-[0_0_28px_rgba(171,89,215,0.45)]" />
        <span className="text-white">POI Collector</span>
      </Link>

      {/* 胶囊导航 */}
      <nav className="hidden rounded-[18px] border border-white/10 bg-white/5 p-1 backdrop-blur-xl md:flex">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-[14px] px-5 py-3 text-sm transition-all duration-200 ${
              index === 0
                ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-white/60 hover:text-white/90"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 登录按钮 */}
      <Link href="/login">
        <Button variant="secondary" size="sm">
          登录
        </Button>
      </Link>
    </motion.header>
  );
}
