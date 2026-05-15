import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/messages - 获取消息列表
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const unreadOnly = searchParams.get("unread") === "true";

  const where: Record<string, unknown> = { toUserId: user.id };
  if (unreadOnly) where.isRead = false;

  const messages = await prisma.message.findMany({
    where,
    include: { fromUser: true, poi: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ data: messages });
}

// POST /api/messages - 发送消息
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();

  const message = await prisma.message.create({
    data: {
      fromUserId: user.id,
      toUserId: body.toUserId,
      type: body.type || "SYSTEM",
      content: body.content,
      poiId: body.poiId || undefined,
    },
    include: { fromUser: true },
  });

  return Response.json({ data: message }, { status: 201 });
}

// PATCH /api/messages - 标记消息已读
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();

  if (body.messageIds) {
    await prisma.message.updateMany({
      where: {
        id: { in: body.messageIds },
        toUserId: user.id,
      },
      data: { isRead: true },
    });
  } else if (body.markAll) {
    await prisma.message.updateMany({
      where: { toUserId: user.id, isRead: false },
      data: { isRead: true },
    });
  }

  return Response.json({ message: "已更新" });
}
