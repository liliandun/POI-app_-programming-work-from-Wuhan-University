"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

interface DiscussionItem {
  id: string;
  status: string;
  adminDecision: string | null;
  createdAt: string;
  poi: { name: string };
  verification: { errorDescription: string; verifier: { nickname: string } };
  messages: Array<{ content: string; user: { nickname: string } }>;
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discussions")
      .then((r) => r.json())
      .then((res) => setDiscussions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">讨论</h1>
        <p className="mt-1 text-sm text-white/50">采集者与核验者的讨论交流</p>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-white/30">加载中...</div>
      ) : discussions.length === 0 ? (
        <div className="py-20 text-center text-white/30">暂无讨论</div>
      ) : (
        <div className="space-y-4">
          {discussions.map((d, i) => {
            const lastMsg = d.messages?.[d.messages.length - 1];
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/dashboard/discussions/${d.id}`}>
                  <GlassCard padding="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-white">
                            {d.verification.errorDescription.slice(0, 30)}
                            {d.verification.errorDescription.length > 30 ? "..." : ""}
                          </h3>
                          <Badge variant={d.status === "OPEN" ? "warning" : "success"}>
                            {d.status === "OPEN" ? "进行中" : "已解决"}
                          </Badge>
                          {d.adminDecision && (
                            <Badge variant="purple">管理员已裁决</Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#F9DB9A]/50 mb-2">
                          关联 POI: {d.poi.name}
                        </p>
                        {lastMsg && (
                          <p className="text-sm text-white/50 truncate">
                            {lastMsg.user.nickname}: {lastMsg.content}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-xs text-white/25">
                          <span>核验者: {d.verification.verifier.nickname}</span>
                          <span>{d.messages?.length || 0} 条消息</span>
                          <span>{new Date(d.createdAt).toLocaleString("zh-CN")}</span>
                        </div>
                      </div>
                      <svg width="20" height="20" className="text-white/20 shrink-0 mt-1" fill="none" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
