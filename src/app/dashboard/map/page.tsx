"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import MapContainer, { type MapMarker } from "@/components/map/MapContainer";
import { POI_CATEGORIES } from "@/types";
import { navigateTo, searchPlace } from "@/lib/amap";

interface MapPOI {
  id: string;
  name: string;
  category: string;
  status: string;
  longitude: number;
  latitude: number;
}

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-400",
  APPROVED: "bg-emerald-400",
  FLAGGED: "bg-red-400",
  CORRECTED: "bg-sky-400",
  REJECTED: "bg-purple-400",
};

export default function MapPage() {
  const [pois, setPois] = useState<MapPOI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [selectedPoi, setSelectedPoi] = useState<MapPOI | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address: string; lng: number; lat: number }>>([]);
  const [searching, setSearching] = useState(false);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const poi = pois.find((p) => p.id === marker.id);
    if (poi) setSelectedPoi(poi);
  }, [pois]);

  const handleNavigate = () => {
    if (!selectedPoi) {
      alert("请先在地图上点击选择一个 POI");
      return;
    }
    const url = navigateTo(selectedPoi.longitude, selectedPoi.latitude, selectedPoi.name);
    window.open(url, "_blank");
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setSearching(true);
    try {
      const result = await searchPlace(searchKeyword.trim());
      setSearchResults(result.pois || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "全部") params.set("category", selectedCategory);
    params.set("pageSize", "100");
    fetch(`/api/poi?${params}`)
      .then((r) => r.json())
      .then((res) => setPois(res.data || []))
      .catch(() => {});
  }, [selectedCategory]);

  return (
    <div className="space-y-4">
      <motion.div
        className="flex items-center justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-medium text-white">地图视图</h1>
          <p className="mt-1 text-sm text-white/50">
            查看 POI 数据分布与状态
            {selectedPoi && (
              <span className="text-[#F9DB9A]/70 ml-2">· 已选: {selectedPoi.name}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 地点搜索 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="搜索地点..."
              className="h-9 w-48 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F9DB9A]/40 transition-all"
            />
            <Button variant="secondary" size="sm" onClick={handleSearch} disabled={searching}>
              {searching ? "搜索中" : "搜索"}
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={handleNavigate}>
            导航至选中 POI
          </Button>
        </div>
      </motion.div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-white/30 self-center">搜索结果:</span>
          {searchResults.slice(0, 5).map((r, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchResults([]);
                setSearchKeyword("");
                // 将搜索结果作为一个临时选中项
                setSelectedPoi({
                  id: `search-${i}`,
                  name: r.name,
                  category: "",
                  status: "",
                  longitude: r.lng,
                  latitude: r.lat,
                });
              }}
              className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
            >
              <span className="font-medium">{r.name}</span>
              {r.address && <span className="text-white/30 ml-1">· {r.address}</span>}
            </button>
          ))}
          <button
            onClick={() => setSearchResults([])}
            className="text-xs text-white/20 hover:text-white/50 self-center ml-1"
          >
            清除
          </button>
        </motion.div>
      )}

      {/* 分类筛选 */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <button
          onClick={() => setSelectedCategory("全部")}
          className={`rounded-full px-4 py-1.5 text-xs border transition-all ${
            selectedCategory === "全部"
              ? "bg-white/10 border-white/20 text-white"
              : "border-white/10 text-white/40 hover:text-white/70"
          }`}
        >
          全部
        </button>
        {POI_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs border transition-all ${
              selectedCategory === cat
                ? "bg-white/10 border-white/20 text-white"
                : "border-white/10 text-white/40 hover:text-white/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* 地图 + 侧边列表 */}
      <motion.div
        className="grid gap-4 lg:grid-cols-[1fr_320px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MapContainer
          className="h-[calc(100vh-280px)] min-h-[400px]"
          markers={pois.map((p) => ({
            id: p.id,
            name: p.name,
            lng: p.longitude,
            lat: p.latitude,
            status: p.status,
            category: p.category,
          }))}
          onMarkerClick={handleMarkerClick}
        />

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
          <p className="text-xs text-white/30 px-1">
            共 {pois.length} 个 POI
          </p>
          {pois.map((poi) => (
            <GlassCard
              key={poi.id}
              padding="p-4"
              className={selectedPoi?.id === poi.id ? "ring-1 ring-[#F9DB9A]/40" : ""}
            >
              <button
                className="flex items-start gap-3 w-full text-left"
                onClick={() => setSelectedPoi(poi)}
              >
                <div className={`mt-1 h-3 w-3 rounded-full ${statusColor[poi.status] || "bg-gray-400"} shrink-0`} />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{poi.name}</h4>
                  <p className="text-xs text-white/40 mt-0.5">{poi.category}</p>
                  <p className="text-xs text-white/20 mt-0.5 font-mono">
                    {poi.longitude.toFixed(3)}, {poi.latitude.toFixed(3)}
                  </p>
                </div>
              </button>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />待审核</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />已通过</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" />已标记错误</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" />已修正</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-400" />已驳回</span>
      </div>
    </div>
  );
}
