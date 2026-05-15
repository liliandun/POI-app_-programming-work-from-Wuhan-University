"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

interface VerifyItem {
  id: string;
  errorDescription: string;
  status: string;
  createdAt: string;
  poi: { name: string };
  verifier: { nickname: string };
}

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "error" | "purple" }> = {
  PENDING: { label: "待处理", variant: "warning" },
  ACCEPTED: { label: "已接受", variant: "success" },
  REJECTED: { label: "已驳回", variant: "error" },
  DISPUTED: { label: "争议中", variant: "purple" },
};

export default function VerifyListPage() {
  const [verifications, setVerifications] = useState<VerifyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/verify")
      .then((r) => r.json())
      .then((res) => setVerifications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">核验审批</h1>
        <p className="mt-1 text-sm text-white/50">查看并处理 POI 数据核验记录</p>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-white/30">加载中...</div>
      ) : verifications.length === 0 ? (
        <div className="py-20 text-center text-white/30">暂无核验记录</div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v, i) => {
            const badge = statusMap[v.status] || { label: v.status, variant: "warning" as const };
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/dashboard/verify/${v.id}`}>
                  <GlassCard padding="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-medium text-white">{v.poi.name}</h3>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-white/50 line-clamp-2">{v.errorDescription}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                          <span>核验者: {v.verifier.nickname}</span>
                          <span>{new Date(v.createdAt).toLocaleString("zh-CN")}</span>
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
