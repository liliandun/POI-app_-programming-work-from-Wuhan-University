"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserInfo {
  nickname: string;
  role: string;
}

const roleLabel: Record<string, string> = {
  COLLECTOR: "采集者",
  VERIFIER: "核验者",
  ADMIN: "管理员",
};

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export default function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((res) => setUser(res.user))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0c0700]/60 px-4 sm:px-6 backdrop-blur-2xl">
      {/* 左侧: 汉堡菜单 + 搜索 */}
      <div className="flex items-center gap-3">
        {/* 汉堡按钮 - 仅移动端 */}
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors lg:hidden"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* 搜索框 */}
        <div className="hidden sm:flex h-10 w-64 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/30">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          搜索 POI...
        </div>
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 消息通知 */}
        <Link
          href="/dashboard/messages"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-colors"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#F67300]" />
        </Link>

        {/* 用户信息 + 退出 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-2 hover:bg-white/[0.04] transition-colors">
            <div className="h-8 w-8 rounded-full bg-[#AB59D7]/30 flex items-center justify-center text-xs text-[#AB59D7] font-medium">
              {user?.nickname?.charAt(0) || "U"}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm text-white/70">{user?.nickname || "未登录"}</span>
              {user?.role && (
                <span className="ml-2 text-xs text-white/30">{roleLabel[user.role] || user.role}</span>
              )}
            </div>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              退出
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
