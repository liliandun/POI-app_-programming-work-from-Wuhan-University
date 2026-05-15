import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/discussions/:id - 获取讨论详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      poi: { include: { collector: true } },
      verification: { include: { verifier: true } },
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) {
    return Response.json({ error: "讨论不存在" }, { status: 404 });
  }

  return Response.json({ data: discussion });
}
