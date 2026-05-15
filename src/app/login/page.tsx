"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleWeChatLogin = () => {
    // TODO: 接入微信 OAuth 登录
    alert("微信登录需要配置 WECHAT_APP_ID，请使用开发模式登录");
  };

  const handleDevLogin = async (role: string) => {
    setLoading(role);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devRole: role }),
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        alert(data.error || "登录失败");
      }
    } catch {
      alert("登录请求失败，请检查数据库连接");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100900] text-white">
      <BackgroundEffects />

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4 h-14 w-14 rounded-2xl bg-[#AB59D7] shadow-[0_0_48px_rgba(171,89,215,0.5)]" />
          <h1 className="text-2xl font-medium text-white">POI Collector</h1>
          <p className="mt-2 text-sm text-white/50">数据采集与核验平台</p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-[28px] border border-[rgba(249,219,154,0.18)] bg-[linear-gradient(180deg,rgba(68,43,21,0.58),rgba(20,13,8,0.42))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[18px]">
          <h2 className="mb-2 text-lg font-medium text-white">欢迎登录</h2>
          <p className="mb-8 text-sm text-white/50">
            使用微信账号登录以开始使用
          </p>

          {/* 微信登录按钮 */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleWeChatLogin}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.329 6.329 0 01-.261-1.786c0-3.784 3.326-6.867 7.432-6.867.258 0 .51.019.76.044C16.672 4.437 13.006 2.188 8.691 2.188zm-2.87 3.937a1.186 1.186 0 110 2.373 1.186 1.186 0 010-2.373zm5.592 0a1.186 1.186 0 110 2.373 1.186 1.186 0 010-2.373z" />
              <path d="M23.673 14.903c0-3.376-3.326-6.117-7.432-6.117-4.105 0-7.431 2.741-7.431 6.117 0 3.378 3.326 6.118 7.431 6.118.86 0 1.685-.137 2.454-.353a.72.72 0 01.588.084l1.56.912a.272.272 0 00.136.045.24.24 0 00.237-.241c0-.059-.024-.117-.039-.174l-.32-1.212a.48.48 0 01.174-.545c1.503-1.104 2.642-2.84 2.642-4.634zm-9.695-1.244a.992.992 0 110-1.984.992.992 0 010 1.984zm4.527 0a.992.992 0 110-1.984.992.992 0 010 1.984z" />
            </svg>
            微信登录
          </Button>

          {/* 分割线 */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-white/30">或</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* 开发调试入口 */}
          <p className="text-center text-xs text-white/30 mb-4">
            开发模式：选择角色直接进入
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => handleDevLogin("collector")}
              disabled={loading !== null}
            >
              {loading === "collector" ? "登录中..." : "采集者"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => handleDevLogin("verifier")}
              disabled={loading !== null}
            >
              {loading === "verifier" ? "登录中..." : "核验者"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => handleDevLogin("admin")}
              disabled={loading !== null}
            >
              {loading === "admin" ? "登录中..." : "管理员"}
            </Button>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            &larr; 返回首页
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
