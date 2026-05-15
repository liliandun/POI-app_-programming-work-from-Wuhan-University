"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-white/[0.06] bg-[#0c0700]/80 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/[0.06]">
        <div className="h-8 w-8 rounded-xl bg-[#AB59D7] shadow-[0_0_28px_rgba(171,89,215,0.45)]" />
        <span className="font-semibold text-white">POI Collector</span>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                }
              `}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 底部用户信息 */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#F67300]/20 flex items-center justify-center text-xs text-[#F9DB9A]">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">未登录</p>
            <p className="text-xs text-white/40">请先登录</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
