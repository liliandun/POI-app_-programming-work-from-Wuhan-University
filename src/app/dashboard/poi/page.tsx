"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import POICard from "@/components/poi/POICard";
import { POI_CATEGORIES } from "@/types";
import type { POIStatus, POICategory } from "@/types";

interface POIItem {
  id: string;
  name: string;
  category: POICategory;
  address: string;
  status: POIStatus;
  photos: string[];
  updatedAt: string;
}

export default function POIListPage() {
  const [pois, setPois] = useState<POIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryFilter !== "全部") params.set("category", categoryFilter);
    if (statusFilter !== "全部") params.set("status", statusFilter);

    setLoading(true);
    fetch(`/api/poi?${params}`)
      .then((r) => r.json())
      .then((res) => setPois(res.data || []))
      .catch(() => setPois([]))
      .finally(() => setLoading(false));
  }, [categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 标题 + 操作 */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-medium text-white">POI 管理</h1>
          <p className="mt-1 text-sm text-white/50">管理所有采集的 POI 数据</p>
        </div>
        <Link href="/dashboard/poi/create">
          <Button variant="primary" size="md">
            + 新建 POI
          </Button>
        </Link>
      </motion.div>

      {/* 筛选器 */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/70 backdrop-blur-xl outline-none appearance-none"
        >
          <option value="全部" className="bg-[#1a0f05]">全部分类</option>
          {POI_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-[#1a0f05]">{cat}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/70 backdrop-blur-xl outline-none appearance-none"
        >
          <option value="全部" className="bg-[#1a0f05]">全部状态</option>
          <option value="PENDING" className="bg-[#1a0f05]">待审核</option>
          <option value="APPROVED" className="bg-[#1a0f05]">已通过</option>
          <option value="FLAGGED" className="bg-[#1a0f05]">已标记错误</option>
          <option value="CORRECTED" className="bg-[#1a0f05]">已修正</option>
          <option value="REJECTED" className="bg-[#1a0f05]">已驳回</option>
        </select>
      </motion.div>

      {/* POI 网格 */}
      {loading ? (
        <div className="py-20 text-center text-white/30">加载中...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pois.map((poi, i) => (
            <motion.div
              key={poi.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <POICard
                id={poi.id}
                name={poi.name}
                category={poi.category}
                address={poi.address}
                status={poi.status}
                updatedAt={new Date(poi.updatedAt).toLocaleString("zh-CN")}
                photoUrl={Array.isArray(poi.photos) && poi.photos.length > 0 ? poi.photos[0] : undefined}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && pois.length === 0 && (
        <div className="py-20 text-center text-white/30">
          暂无匹配的 POI 数据
        </div>
      )}
    </div>
  );
}
