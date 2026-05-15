import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/discussions - 获取讨论列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const poiId = searchParams.get("poiId");

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (poiId) where.poiId = poiId;

  const discussions = await prisma.discussion.findMany({
    where,
    include: {
      poi: true,
      verification: { include: { verifier: true } },
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ data: discussions });
}

// POST /api/discussions - 创建讨论 / 发送讨论消息
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();

  // 发送讨论消息
  if (body.discussionId && body.content) {
    const msg = await prisma.discussionMessage.create({
      data: {
        discussionId: body.discussionId,
        userId: user.id,
        content: body.content,
      },
      include: { user: true },
    });
    return Response.json({ data: msg }, { status: 201 });
  }

  // 创建新讨论
  const discussion = await prisma.discussion.create({
    data: {
      poiId: body.poiId,
      verificationId: body.verificationId,
    },
    include: { poi: true, verification: true },
  });

  // 更新核验状态为 DISPUTED
  await prisma.verification.update({
    where: { id: body.verificationId },
    data: { status: "DISPUTED" },
  });

  return Response.json({ data: discussion }, { status: 201 });
}

// PATCH /api/discussions - 管理员裁决
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "仅管理员可进行裁决" }, { status: 403 });
  }

  const body = await request.json();
  const { discussionId, decision } = body;
  // decision: "SUPPORT_COLLECTOR" | "SUPPORT_VERIFIER"

  const discussion = await prisma.discussion.update({
    where: { id: discussionId },
    data: {
      status: "RESOLVED",
      adminDecision: decision,
      resolvedAt: new Date(),
    },
    include: {
      poi: true,
      verification: { include: { verifier: true } },
    },
  });

  // 根据裁决结果更新 POI 和核验状态
  if (decision === "SUPPORT_VERIFIER") {
    await prisma.verification.update({
      where: { id: discussion.verificationId },
      data: { status: "ACCEPTED" },
    });
    await prisma.poi.update({
      where: { id: discussion.poiId },
      data: { status: "CORRECTED" },
    });
  } else {
    await prisma.verification.update({
      where: { id: discussion.verificationId },
      data: { status: "REJECTED" },
    });
    await prisma.poi.update({
      where: { id: discussion.poiId },
      data: { status: "APPROVED" },
    });
  }

  // 通知双方裁决结果
  const decisionText = decision === "SUPPORT_COLLECTOR" ? "支持采集者" : "支持核验者";
  const participants = [discussion.poi.collectorId, discussion.verification.verifierId];
  for (const toUserId of participants) {
    await prisma.message.create({
      data: {
        fromUserId: user.id,
        toUserId,
        type: "RESULT_NOTIFY",
        content: `管理员已对 "${discussion.poi.name}" 的争议做出裁决：${decisionText}`,
        poiId: discussion.poiId,
      },
    });
  }

  return Response.json({ data: discussion });
}
