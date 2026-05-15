import { prisma } from "@/lib/prisma";

// GET /api/stats - 获取仪表盘统计数据
export async function GET() {
  const [total, pending, flagged, approved] = await Promise.all([
    prisma.poi.count(),
    prisma.poi.count({ where: { status: "PENDING" } }),
    prisma.poi.count({ where: { status: "FLAGGED" } }),
    prisma.poi.count({ where: { status: { in: ["APPROVED", "CORRECTED"] } } }),
  ]);

  // 最近活动：最新的 POI 和核验记录
  const recentPois = await prisma.poi.findMany({
    include: { collector: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentVerifications = await prisma.verification.findMany({
    include: { verifier: true, poi: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return Response.json({
    stats: { total, pending, flagged, approved },
    recentPois,
    recentVerifications,
  });
}
