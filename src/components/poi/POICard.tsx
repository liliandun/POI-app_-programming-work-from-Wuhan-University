"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import POIStatusBadge from "./POIStatusBadge";
import type { POIStatus, POICategory } from "@/types";

interface POICardProps {
  id: string;
  name: string;
  category: POICategory;
  address: string;
  status: POIStatus;
  updatedAt: string;
  photoUrl?: string;
}

export default function POICard({
  id,
  name,
  category,
  address,
  status,
  updatedAt,
  photoUrl,
}: POICardProps) {
  return (
    <Link href={`/dashboard/poi/${id}`}>
      <GlassCard padding="p-0" className="overflow-hidden">
        {/* 图片区域 */}
        <div className="h-40 bg-white/[0.04] flex items-center justify-center text-white/20">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {/* 信息 */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-white truncate">{name}</h3>
            <POIStatusBadge status={status} />
          </div>
          <p className="mt-1 text-xs text-white/40">{category}</p>
          <p className="mt-1 text-xs text-white/30 truncate">{address}</p>
          <p className="mt-2 text-xs text-white/20">{updatedAt}</p>
        </div>
      </GlassCard>
    </Link>
  );
}
