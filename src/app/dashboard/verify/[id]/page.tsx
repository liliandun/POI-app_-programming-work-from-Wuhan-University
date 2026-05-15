"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface VerificationData {
  id: string;
  errorDescription: string;
  status: string;
  newLongitude: number | null;
  newLatitude: number | null;
  newCategory: string | null;
  newDescription: string | null;
  createdAt: string;
  poi: {
    id: string;
    name: string;
    longitude: number;
    latitude: number;
    category: string;
    description: string;
    collector: { nickname: string };
  };
  verifier: { nickname: string };
}

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "error" | "purple" }> = {
  PENDING: { label: "待处理", variant: "warning" },
  ACCEPTED: { label: "已接受", variant: "success" },
  REJECTED: { label: "已驳回", variant: "error" },
  DISPUTED: { label: "争议中", variant: "purple" },
};

export default function VerifyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    fetch(`/api/verify/${id}`)
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: "accept" | "reject") => {
    setActing(true);
    try {
      const res = await fetch("/api/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId: id, action }),
      });
      if (res.ok) {
        router.push("/dashboard/verify");
      } else {
        const err = await res.json();
        alert(err.error || "操作失败");
      }
    } catch {
      alert("请求失败");
    } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-white/30">加载中...</div>;
  if (!data) return <div className="py-20 text-center text-white/30">核验记录不存在</div>;

  const badge = statusMap[data.status] || { label: data.status, variant: "warning" as const };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">核验详情</h1>
        <p className="mt-1 text-sm text-white/40">关联 POI: {data.poi.name}</p>
      </motion.div>

      {/* 错误信息 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-medium text-white">错误描述</h2>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{data.errorDescription}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/30">
            <span>核验者: {data.verifier.nickname}</span>
            <span>{new Date(data.createdAt).toLocaleString("zh-CN")}</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* 对比：原始 vs 建议 */}
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard hover={false}>
          <h3 className="text-sm font-medium text-white/60 mb-3">原始数据</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">经度</span>
              <span className="text-white/70 font-mono">{data.poi.longitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">纬度</span>
              <span className="text-white/70 font-mono">{data.poi.latitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">分类</span>
              <span className="text-white/70">{data.poi.category}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-sm font-medium text-[#F9DB9A]/80 mb-3">建议更新</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">经度</span>
              <span className={`font-mono ${data.newLongitude ? "text-[#F9DB9A]" : "text-white/40"}`}>
                {data.newLongitude ?? "未修改"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">纬度</span>
              <span className={`font-mono ${data.newLatitude ? "text-[#F9DB9A]" : "text-white/40"}`}>
                {data.newLatitude ?? "未修改"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">分类</span>
              <span className={data.newCategory ? "text-[#F9DB9A]" : "text-white/40"}>
                {data.newCategory ?? "未修改"}
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 操作按钮 */}
      {data.status === "PENDING" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard hover={false}>
            <h3 className="text-sm font-medium text-white mb-4">采集者处理</h3>
            <p className="text-xs text-white/40 mb-4">
              请确认核验者反馈的错误信息，选择接受更新或驳回
            </p>
            <div className="flex gap-3">
              <Button variant="primary" size="md" className="flex-1" onClick={() => handleAction("accept")} disabled={acting}>
                接受更新
              </Button>
              <Button variant="danger" size="md" className="flex-1" onClick={() => handleAction("reject")} disabled={acting}>
                驳回
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
