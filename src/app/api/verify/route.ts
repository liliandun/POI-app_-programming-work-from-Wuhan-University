import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/verify - 获取核验记录列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const poiId = searchParams.get("poiId");

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (poiId) where.poiId = poiId;

  const verifications = await prisma.verification.findMany({
    where,
    include: { poi: true, verifier: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ data: verifications });
}

// POST /api/verify - 创建核验记录 (核验者标记错误)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();

  // 创建核验记录
  const verification = await prisma.verification.create({
    data: {
      poiId: body.poiId,
      verifierId: user.id,
      errorDescription: body.errorDescription,
      newPhotos: body.newPhotos || [],
      newLongitude: body.newLongitude ? parseFloat(body.newLongitude) : undefined,
      newLatitude: body.newLatitude ? parseFloat(body.newLatitude) : undefined,
      newCategory: body.newCategory || undefined,
      newDescription: body.newDescription || undefined,
    },
    include: { poi: true, verifier: true },
  });

  // 更新 POI 状态为 FLAGGED
  await prisma.poi.update({
    where: { id: body.poiId },
    data: { status: "FLAGGED" },
  });

  // 发送消息通知采集者
  const poi = await prisma.poi.findUnique({ where: { id: body.poiId } });
  if (poi) {
    await prisma.message.create({
      data: {
        fromUserId: user.id,
        toUserId: poi.collectorId,
        type: "ERROR_NOTIFY",
        content: `您的 POI "${poi.name}" 被核验者标记了错误：${body.errorDescription}`,
        poiId: poi.id,
      },
    });
  }

  return Response.json({ data: verification }, { status: 201 });
}

// PATCH /api/verify - 采集者处理核验 (接受/驳回)
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const { verificationId, action } = body; // action: "accept" | "reject"

  const verification = await prisma.verification.findUnique({
    where: { id: verificationId },
    include: { poi: true },
  });
  if (!verification) {
    return Response.json({ error: "核验记录不存在" }, { status: 404 });
  }

  if (action === "accept") {
    // 接受核验意见，更新核验状态
    await prisma.verification.update({
      where: { id: verificationId },
      data: { status: "ACCEPTED" },
    });

    // 使用核验者提供的新数据更新 POI
    const updateData: Record<string, unknown> = { status: "CORRECTED" as const };
    if (verification.newLongitude) updateData.longitude = verification.newLongitude;
    if (verification.newLatitude) updateData.latitude = verification.newLatitude;
    if (verification.newCategory) updateData.category = verification.newCategory;
    if (verification.newDescription) updateData.description = verification.newDescription;

    await prisma.poi.update({
      where: { id: verification.poiId },
      data: updateData,
    });

    // 通知核验者
    await prisma.message.create({
      data: {
        fromUserId: user.id,
        toUserId: verification.verifierId,
        type: "RESULT_NOTIFY",
        content: `采集者已接受您对 "${verification.poi.name}" 的核验意见`,
        poiId: verification.poiId,
      },
    });
  } else if (action === "reject") {
    // 驳回核验意见
    await prisma.verification.update({
      where: { id: verificationId },
      data: { status: "REJECTED" },
    });

    await prisma.poi.update({
      where: { id: verification.poiId },
      data: { status: "PENDING" },
    });

    // 通知核验者
    await prisma.message.create({
      data: {
        fromUserId: user.id,
        toUserId: verification.verifierId,
        type: "RESULT_NOTIFY",
        content: `采集者已驳回您对 "${verification.poi.name}" 的核验意见`,
        poiId: verification.poiId,
      },
    });
  }

  return Response.json({ message: "处理成功" });
}
