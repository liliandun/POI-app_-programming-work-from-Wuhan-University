"use client";

import { useEffect, useRef, useCallback } from "react";

// 高德地图类型声明
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: { securityJsCode: string };
  }
}

export interface MapMarker {
  id: string;
  name: string;
  lng: number;
  lat: number;
  status?: string;
  category?: string;
}

interface MapContainerProps {
  className?: string;
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  /** 点击地图回调坐标 */
  onClick?: (lng: number, lat: number) => void;
  /** 点击标记点回调 */
  onMarkerClick?: (marker: MapMarker) => void;
  /** 单个定位点（POI 详情页用） */
  point?: { lng: number; lat: number; name: string };
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#34d399",
  FLAGGED: "#f87171",
  CORRECTED: "#38bdf8",
  REJECTED: "#a78bfa",
};

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: Array<() => void> = [];

export function loadAmapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded && window.AMap) {
      resolve();
      return;
    }
    loadCallbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;

    const key = process.env.NEXT_PUBLIC_AMAP_KEY;
    if (!key) {
      console.warn("NEXT_PUBLIC_AMAP_KEY 未配置");
      return;
    }

    // 配置安全密钥
    const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE;
    if (securityCode) {
      window._AMapSecurityConfig = { securityJsCode: securityCode };
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.MarkerCluster,AMap.InfoWindow,AMap.Geocoder,AMap.PlaceSearch,AMap.AutoComplete`;
    script.onload = () => {
      scriptLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

export default function MapContainer({
  className = "",
  markers,
  center,
  zoom = 12,
  onClick,
  onMarkerClick,
  point,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 初始化地图
  useEffect(() => {
    let destroyed = false;
    loadAmapScript().then(() => {
      if (destroyed || !containerRef.current || !window.AMap) return;
      const defaultCenter = center || [116.397, 39.908]; // 默认北京天安门
      const map = new window.AMap.Map(containerRef.current, {
        zoom: point ? 16 : zoom,
        center: point ? [point.lng, point.lat] : defaultCenter,
        mapStyle: "amap://styles/dark",
        resizeEnable: true,
      });
      mapRef.current = map;

      // 单点标记（详情页）
      if (point) {
        const marker = new window.AMap.Marker({
          position: [point.lng, point.lat],
          title: point.name,
        });
        map.add(marker);
      }

      // 地图点击事件（选点）
      if (onClick) {
        map.on("click", (e: any) => {
          onClick(e.lnglat.getLng(), e.lnglat.getLat());
        });
      }
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 更新 markers
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !window.AMap || !markers) return;

    // 清除旧标记
    markersRef.current.forEach((m) => map.remove(m));
    markersRef.current = [];

    markers.forEach((m) => {
      const color = STATUS_COLOR[m.status || ""] || "#f59e0b";
      const markerInstance = new window.AMap.Marker({
        position: [m.lng, m.lat],
        title: m.name,
        content: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.8);
          box-shadow:0 0 6px ${color};
        "></div>`,
        offset: new window.AMap.Pixel(-7, -7),
      });

      markerInstance.on("click", () => {
        const infoWindow = new window.AMap.InfoWindow({
          content: `
            <div style="padding:8px 12px;min-width:160px;">
              <div style="font-weight:600;margin-bottom:4px;">${m.name}</div>
              <div style="font-size:12px;color:#666;">${m.category || ""}</div>
              <div style="font-size:11px;color:#999;margin-top:2px;">${m.lng.toFixed(5)}, ${m.lat.toFixed(5)}</div>
            </div>
          `,
          offset: new window.AMap.Pixel(0, -12),
        });
        infoWindow.open(map, [m.lng, m.lat]);
        onMarkerClick?.(m);
      });

      map.add(markerInstance);
      markersRef.current.push(markerInstance);
    });

    // 自适应视野
    if (markers.length > 0) {
      map.setFitView(markersRef.current, false, [60, 60, 60, 60]);
    }
  }, [markers, onMarkerClick]);

  useEffect(() => {
    // 等地图初始化完成再更新 markers
    const check = () => {
      if (mapRef.current) {
        updateMarkers();
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  }, [updateMarkers]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border border-white/10 overflow-hidden ${className}`}
    />
  );
}
