"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface DiscussionItem {
  id: string;
  status: string;
  adminDecision: string | null;
  resolvedAt: string | null;
  createdAt: string;
  poi: { name: string; collector: { nickname: string } };
  verification: { errorDescription: string; verifier: { nickname: string } };
  messages: Array<{ id: string }>;
}

export default function AdminPage() {
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discussions")
      .then((r) => r.json())
      .then((res) => setDiscussions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = discussions.filter((d) => d.status === "OPEN");
  const resolved = discussions.filter((d) => d.status === "RESOLVED");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">管理仲裁</h1>
        <p className="mt-1 text-sm text-white/50">处理采集者与核验者之间的争议</p>
      </motion.div>

      {/* 统计 */}
      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <GlassCard padding="p-5">
          <p className="text-sm text-white/50">待仲裁</p>
          <p className="mt-2 text-3xl font-semibold text-[#F67300]">{loading ? "–" : pending.length}</p>
        </GlassCard>
        <GlassCard padding="p-5">
          <p className="text-sm text-white/50">已裁决</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">{loading ? "–" : resolved.length}</p>
        </GlassCard>
        <GlassCard padding="p-5">
          <p className="text-sm text-white/50">总讨论数</p>
          <p className="mt-2 text-3xl font-semibold text-white">{loading ? "–" : discussions.length}</p>
        </GlassCard>
      </motion.div>

      {/* 待仲裁列表 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <GlassCard hover={false}>
          <h2 className="text-lg font-medium text-white mb-4">待仲裁争议</h2>
          {loading ? (
            <p className="text-sm text-white/30 py-8 text-center">加载中...</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-white/30 py-8 text-center">暂无待仲裁争议</p>
          ) : (
            <div className="space-y-3">
              {pending.map((arb) => (
                <div
                  key={arb.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-white">
                        {arb.verification.errorDescription.slice(0, 30)}...
                      </h3>
                      <Badge variant="warning">待裁决</Badge>
                    </div>
                    <p className="text-xs text-[#F9DB9A]/50">POI: {arb.poi.name}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {arb.poi.collector.nickname} vs {arb.verification.verifier.nickname} | {arb.messages.length} 条讨论 | {new Date(arb.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <Link href={`/dashboard/discussions/${arb.id}`}>
                    <Button variant="secondary" size="sm">
                      查看详情
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* 已裁决列表 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard hover={false}>
          <h2 className="text-lg font-medium text-white mb-4">已裁决记录</h2>
          {resolved.length === 0 ? (
            <p className="text-sm text-white/30 py-8 text-center">暂无裁决记录</p>
          ) : (
            <div className="space-y-3">
              {resolved.map((arb) => (
                <div
                  key={arb.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-white">
                        {arb.verification.errorDescription.slice(0, 30)}...
                      </h3>
                      <Badge variant="success">已解决</Badge>
                      {arb.adminDecision && (
                        <Badge variant="purple">
                          {arb.adminDecision === "SUPPORT_COLLECTOR" ? "支持采集者" : "支持核验者"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/30">
                      POI: {arb.poi.name} | 裁决时间: {arb.resolvedAt ? new Date(arb.resolvedAt).toLocaleString("zh-CN") : "–"}
                    </p>
                  </div>
                  <Link href={`/dashboard/discussions/${arb.id}`}>
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
