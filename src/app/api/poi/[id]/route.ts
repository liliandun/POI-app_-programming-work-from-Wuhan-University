import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/poi/:id - 获取 POI 详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const poi = await prisma.poi.findUnique({
    where: { id },
    include: {
      collector: true,
      verifications: {
        include: { verifier: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!poi) {
    return Response.json({ error: "POI 不存在" }, { status: 404 });
  }

  return Response.json({ data: poi });
}

// PUT /api/poi/:id - 更新 POI
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const existing = await prisma.poi.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "POI 不存在" }, { status: 404 });
  }

  // 仅采集者本人或管理员可编辑
  if (existing.collectorId !== user.id && user.role !== "ADMIN") {
    return Response.json({ error: "无权限修改此 POI" }, { status: 403 });
  }

  const body = await request.json();
  const poi = await prisma.poi.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.category && { category: body.category }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.longitude && { longitude: parseFloat(body.longitude) }),
      ...(body.latitude && { latitude: parseFloat(body.latitude) }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.photos && { photos: body.photos }),
      ...(body.status && { status: body.status }),
    },
    include: { collector: true },
  });

  return Response.json({ data: poi });
}

// DELETE /api/poi/:id - 删除 POI
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const existing = await prisma.poi.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "POI 不存在" }, { status: 404 });
  }

  if (existing.collectorId !== user.id && user.role !== "ADMIN") {
    return Response.json({ error: "无权限删除此 POI" }, { status: 403 });
  }

  await prisma.poi.delete({ where: { id } });

  return Response.json({ message: "已删除" });
}
