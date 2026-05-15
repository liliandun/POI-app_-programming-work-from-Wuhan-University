/**
 * 高德地图工具模块 (Placeholder)
 *
 * 待配置以下环境变量后启用:
 * - NEXT_PUBLIC_AMAP_KEY (JS API Key)
 * - NEXT_PUBLIC_AMAP_SECURITY_CODE (安全密钥)
 *
 * Web 端使用高德地图 JS API v2.0:
 * https://lbs.amap.com/api/javascript-api-v2/summary
 */

/** 高德地图 JS API 加载配置 */
export const AMAP_CONFIG = {
  key: process.env.NEXT_PUBLIC_AMAP_KEY || "",
  securityCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || "",
  version: "2.0",
  plugins: [
    "AMap.Geocoder",       // 地理编码
    "AMap.PlaceSearch",    // POI 搜索
    "AMap.Driving",        // 驾车导航
    "AMap.Walking",        // 步行导航
    "AMap.MarkerCluster",  // 点聚合
    "AMap.InfoWindow",     // 信息窗体
  ],
};

/** 生成高德地图 JS API script URL */
export function getAmapScriptUrl(): string {
  const { key, version, plugins } = AMAP_CONFIG;
  return `https://webapi.amap.com/maps?v=${version}&key=${key}&plugin=${plugins.join(",")}`;
}

/**
 * 调起高德地图导航
 * 在移动端打开高德地图 App 导航；在 PC 端打开高德网页版
 */
export function navigateTo(lng: number, lat: number, name: string): string {
  // 高德地图导航 URI
  // 移动端: amapuri://route/plan/?...
  // Web 端: https://uri.amap.com/navigation?...
  return `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&callnative=1`;
}

/**
 * 逆地理编码 (坐标 → 地址)
 * 使用客户端 AMap.Geocoder 插件，无需 Web 服务 Key
 */
export async function reverseGeocode(lng: number, lat: number): Promise<{
  address: string;
}> {
  // 动态导入以避免服务端引用 window
  const { loadAmapScript } = await import("@/components/map/MapContainer");
  await loadAmapScript();

  return new Promise((resolve) => {
    if (!window.AMap) {
      resolve({ address: "" });
      return;
    }
    const geocoder = new window.AMap.Geocoder();
    geocoder.getAddress([lng, lat], (status: string, result: any) => {
      if (status === "complete" && result.regeocode) {
        resolve({ address: result.regeocode.formattedAddress });
      } else {
        console.warn("[Amap] reverseGeocode failed:", status);
        resolve({ address: "" });
      }
    });
  });
}

/**
 * 关键词搜索 POI
 * 使用客户端 AMap.PlaceSearch 插件，无需 Web 服务 Key
 */
export async function searchPlace(keywords: string, city?: string): Promise<{
  pois: Array<{ name: string; address: string; lng: number; lat: number; type: string }>;
  count: string;
}> {
  const { loadAmapScript } = await import("@/components/map/MapContainer");
  await loadAmapScript();

  return new Promise((resolve) => {
    if (!window.AMap) {
      resolve({ pois: [], count: "0" });
      return;
    }
    const placeSearch = new window.AMap.PlaceSearch({
      pageSize: 10,
      city: city || "",
    });
    placeSearch.search(keywords, (status: string, result: any) => {
      if (status === "complete" && result.poiList) {
        const pois = result.poiList.pois.map((p: any) => ({
          name: p.name,
          address: p.address || "",
          lng: p.location.getLng(),
          lat: p.location.getLat(),
          type: p.type || "",
        }));
        resolve({ pois, count: String(result.poiList.count) });
      } else {
        console.warn("[Amap] searchPlace failed:", status);
        resolve({ pois: [], count: "0" });
      }
    });
  });
}
