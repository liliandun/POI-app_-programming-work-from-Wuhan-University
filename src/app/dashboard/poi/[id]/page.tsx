"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import POIStatusBadge from "@/components/poi/POIStatusBadge";
import MapContainer from "@/components/map/MapContainer";
import Link from "next/link";
import type { POIStatus } from "@/types";

interface POIData {
  id: string;
  name: string;
  category: string;
  description: string;
  longitude: number;
  latitude: number;
  address: string;
  photos: string[];
  status: POIStatus;
  collector: { nickname: string };
  createdAt: string;
  updatedAt: string;
  verifications: Array<{
    id: string;
    errorDescription: string;
    status: string;
    verifier: { nickname: string };
    createdAt: string;
  }>;
}

export default function POIDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [poi, setPoi] = useState<POIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/poi/${id}`)
      .then((r) => r.json())
      .then((res) => setPoi(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("确定要删除此 POI 吗？")) return;
    const res = await fetch(`/api/poi/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/poi");
    } else {
      alert("删除失败");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white/30">加载中...</div>;
  }

  if (!poi) {
    return <div className="py-20 text-center text-white/30">POI 不存在</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题 */}
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium text-white">{poi.name}</h1>
            <POIStatusBadge status={poi.status} />
          </div>
          <p className="mt-1 text-sm text-white/40">ID: {id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 左侧主信息 */}
        <div className="space-y-6">
          {/* 基本信息 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassCard hover={false}>
              <h2 className="text-lg font-medium text-white mb-4">基本信息</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">分类</span>
                  <Badge variant="info">{poi.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">地址</span>
                  <span className="text-sm text-white/70">{poi.address || "未填写"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">经度</span>
                  <span className="text-sm text-white/70 font-mono">{poi.longitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">纬度</span>
                  <span className="text-sm text-white/70 font-mono">{poi.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">采集者</span>
                  <span className="text-sm text-white/70">{poi.collector.nickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">创建时间</span>
                  <span className="text-sm text-white/70">{new Date(poi.createdAt).toLocaleString("zh-CN")}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 描述 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <GlassCard hover={false}>
              <h2 className="text-lg font-medium text-white mb-4">描述信息</h2>
              <p className="text-sm text-white/60 leading-relaxed">{poi.description || "暂无描述"}</p>
            </GlassCard>
          </motion.div>

          {/* 照片 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <GlassCard hover={false}>
              <h2 className="text-lg font-medium text-white mb-4">POI 照片</h2>
              <div className="grid grid-cols-3 gap-3">
                {Array.isArray(poi.photos) && poi.photos.length > 0 ? (
                  poi.photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-white/[0.04] overflow-hidden">
                      <img src={photo} alt={`照片 ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center text-white/20 text-sm">
                    暂无照片
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* 核验记录 */}
          {poi.verifications && poi.verifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <GlassCard hover={false}>
                <h2 className="text-lg font-medium text-white mb-4">核验记录</h2>
                <div className="space-y-3">
                  {poi.verifications.map((v) => (
                    <Link key={v.id} href={`/dashboard/verify/${v.id}`}>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{v.verifier.nickname}</span>
                          <Badge variant={v.status === "PENDING" ? "warning" : v.status === "ACCEPTED" ? "success" : "error"}>
                            {v.status === "PENDING" ? "待处理" : v.status === "ACCEPTED" ? "已接受" : v.status === "REJECTED" ? "已驳回" : "争议中"}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/50 line-clamp-2">{v.errorDescription}</p>
                        <p className="text-xs text-white/25 mt-1">{new Date(v.createdAt).toLocaleString("zh-CN")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* 右侧地图 + 操作 */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <GlassCard hover={false} padding="p-0">
              <MapContainer
                className="h-48 rounded-t-[28px]"
                point={{ lng: poi.longitude, lat: poi.latitude, name: poi.name }}
              />
              <div className="p-4">
                <a
                  href={`https://uri.amap.com/navigation?to=${poi.longitude},${poi.latitude},${encodeURIComponent(poi.name)}&mode=car&callnative=1`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" size="sm" className="w-full">
                    导航至此位置
                  </Button>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <GlassCard hover={false}>
              <h3 className="text-sm font-medium text-white mb-3">讨论</h3>
              <p className="text-xs text-white/40 mb-3">对此 POI 数据有疑问？发起讨论</p>
              <Link href={`/dashboard/discussions/new?poi=${id}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  发起讨论
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
