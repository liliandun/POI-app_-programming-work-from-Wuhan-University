"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface StatsData {
  stats: { total: number; pending: number; flagged: number; approved: number };
  recentPois: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
    collector: { nickname: string };
  }>;
  recentVerifications: Array<{
    id: string;
    poi: { name: string };
    verifier: { nickname: string };
    status: string;
    createdAt: string;
  }>;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "error" | "info" | "purple" }> = {
  PENDING: { label: "待审核", variant: "warning" },
  FLAGGED: { label: "已标记", variant: "error" },
  CORRECTED: { label: "已修正", variant: "info" },
  APPROVED: { label: "已通过", variant: "success" },
  DISPUTED: { label: "讨论中", variant: "purple" },
  ACCEPTED: { label: "已接受", variant: "success" },
  REJECTED: { label: "已驳回", variant: "error" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export default function DashboardPage() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const stats = data?.stats
    ? [
        { label: "总 POI 数", value: data.stats.total.toLocaleString(), variant: "info" as const },
        { label: "待核验", value: data.stats.pending.toLocaleString(), variant: "warning" as const },
        { label: "已标记错误", value: data.stats.flagged.toLocaleString(), variant: "error" as const },
        { label: "已完成", value: data.stats.approved.toLocaleString(), variant: "success" as const },
      ]
    : [
        { label: "总 POI 数", value: "–", variant: "info" as const },
        { label: "待核验", value: "–", variant: "warning" as const },
        { label: "已标记错误", value: "–", variant: "error" as const },
        { label: "已完成", value: "–", variant: "success" as const },
      ];

  // 合并最近的 POI 和核验活动
  const activities = [
    ...(data?.recentPois?.map((p) => ({
      id: `poi-${p.id}`,
      action: "新增 POI",
      poi: p.name,
      user: p.collector.nickname,
      time: timeAgo(p.createdAt),
      status: p.status,
    })) || []),
    ...(data?.recentVerifications?.map((v) => ({
      id: `ver-${v.id}`,
      action: "标记错误",
      poi: v.poi.name,
      user: v.verifier.nickname,
      time: timeAgo(v.createdAt),
      status: v.status,
    })) || []),
  ].sort((a, b) => 0 - a.time.localeCompare(b.time)).slice(0, 8);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">概览</h1>
        <p className="mt-1 text-sm text-white/50">欢迎回来，这是数据摘要</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <GlassCard padding="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">{stat.label}</p>
                <Badge variant={stat.variant}>{stat.label.slice(0, 2)}</Badge>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 最近活动 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <GlassCard hover={false}>
          <h2 className="mb-4 text-lg font-medium text-white">最近活动</h2>
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/30">
              {data ? "暂无活动记录" : "加载中..."}
            </p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const badge = statusBadge[activity.status] || { label: activity.status, variant: "default" as const };
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-[#F67300]" />
                      <div>
                        <p className="text-sm text-white">
                          {activity.user}
                          <span className="text-white/40"> {activity.action} </span>
                          {activity.poi}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
