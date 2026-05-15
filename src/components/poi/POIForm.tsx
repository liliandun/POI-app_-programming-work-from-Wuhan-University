"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MapContainer from "@/components/map/MapContainer";
import { POI_CATEGORIES } from "@/types";
import { reverseGeocode } from "@/lib/amap";

interface POIFormProps {
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

export default function POIForm({ onSubmit, loading }: POIFormProps) {
  const [category, setCategory] = useState("");
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [address, setAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(new FormData(e.currentTarget));
    }
  };

  const handleMapClick = async (longitude: number, latitude: number) => {
    setLng(longitude.toFixed(6));
    setLat(latitude.toFixed(6));

    // 逆地理编码自动填充地址
    setGeocoding(true);
    try {
      const result = await reverseGeocode(longitude, latitude);
      if (result.address) {
        setAddress(result.address);
      }
    } catch {
      // 逆地理编码失败不影响选点
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input name="name" label="POI 名称" placeholder="请输入 POI 名称" required />

      {/* 分类选择 */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">POI 分类</label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white backdrop-blur-xl outline-none transition-all duration-200 focus:border-[#F9DB9A]/40 focus:bg-white/[0.06] appearance-none"
        >
          <option value="" disabled className="bg-[#1a0f05]">
            请选择分类
          </option>
          {POI_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-[#1a0f05]">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <Input
        name="address"
        label={geocoding ? "地址（正在获取...）" : "地址"}
        placeholder="请输入详细地址，或在地图上点击自动获取"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* 经纬度 */}
      <div className="grid grid-cols-2 gap-4">
        <Input name="longitude" label="经度" placeholder="如: 116.397128" type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)} />
        <Input name="latitude" label="纬度" placeholder="如: 39.916527" type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)} />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">描述信息</label>
        <textarea
          name="description"
          rows={4}
          placeholder="请输入 POI 的基本描述信息"
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 backdrop-blur-xl outline-none transition-all duration-200 focus:border-[#F9DB9A]/40 focus:bg-white/[0.06] resize-none"
        />
      </div>

      {/* 照片上传 */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">上传照片</label>
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] px-6 py-10 transition-colors hover:border-[#F9DB9A]/20 hover:bg-white/[0.04] cursor-pointer">
          <div className="text-center">
            <svg className="mx-auto h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-white/40">
              点击或拖拽上传照片
            </p>
            <p className="mt-1 text-xs text-white/20">
              支持 JPG、PNG 格式
            </p>
          </div>
          <input type="file" name="photos" accept="image/*" multiple className="hidden" />
        </div>
      </div>

      {/* 地图选点 */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">地图选点（点击地图选择坐标）</label>
        <div className="relative">
          <MapContainer
            className="h-56"
            onClick={handleMapClick}
            point={lng && lat ? { lng: parseFloat(lng), lat: parseFloat(lat), name: "选中位置" } : undefined}
          />
          {lng && lat && (
            <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm">
              已选: {parseFloat(lng).toFixed(5)}, {parseFloat(lat).toFixed(5)}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost">
          取消
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "提交中..." : "提交 POI"}
        </Button>
      </div>
    </form>
  );
}
