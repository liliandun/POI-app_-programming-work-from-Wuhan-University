import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/verify/:id - 获取核验记录详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const verification = await prisma.verification.findUnique({
    where: { id },
    include: {
      poi: { include: { collector: true } },
      verifier: true,
      discussions: true,
    },
  });

  if (!verification) {
    return Response.json({ error: "核验记录不存在" }, { status: 404 });
  }

  return Response.json({ data: verification });
}
