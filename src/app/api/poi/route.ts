import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/poi - 获取 POI 列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const where: Record<string, string> = {};
  if (category) where.category = category;
  if (status) where.status = status;

  const [pois, total] = await Promise.all([
    prisma.poi.findMany({
      where,
      include: { collector: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.poi.count({ where }),
  ]);

  return Response.json({
    data: pois,
    pagination: { page, pageSize, total },
  });
}

// POST /api/poi - 创建 POI
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const name = body.name?.trim();
    const category = body.category?.trim();
    const longitude = parseFloat(body.longitude);
    const latitude = parseFloat(body.latitude);

    if (!name) return Response.json({ error: "名称不能为空" }, { status: 400 });
    if (!category) return Response.json({ error: "请选择分类" }, { status: 400 });
    if (isNaN(longitude) || isNaN(latitude)) {
      return Response.json({ error: "经纬度无效，请在地图上选点或手动输入" }, { status: 400 });
    }

    const poi = await prisma.poi.create({
      data: {
        name,
        category,
        description: body.description || "",
        longitude,
        latitude,
        address: body.address || "",
        photos: body.photos || [],
        collectorId: user.id,
      },
      include: { collector: true },
    });

    return Response.json({ data: poi }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/poi error:", err);
    return Response.json({ error: "创建 POI 失败，请重试" }, { status: 500 });
  }
}
