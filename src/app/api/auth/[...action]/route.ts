import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/auth";

// GET /api/auth/session - 获取当前会话
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const route = action.join("/");

  if (route === "session") {
    const token = request.cookies.get("token")?.value;
    if (!token) return Response.json({ user: null });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return Response.json({ user: null });

    return Response.json({ user });
  }

  return Response.json({ error: "未知路由" }, { status: 404 });
}

// POST /api/auth/login - 微信 OAuth 登录 / 开发模式登录
// POST /api/auth/logout - 退出登录
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const route = action.join("/");

  if (route === "login") {
    const body = await request.json();

    // 开发模式：通过角色直接登录
    if (body.devRole) {
      const roleMap: Record<string, "COLLECTOR" | "VERIFIER" | "ADMIN"> = {
        collector: "COLLECTOR",
        verifier: "VERIFIER",
        admin: "ADMIN",
      };
      const role = roleMap[body.devRole];
      if (!role) {
        return Response.json({ error: "无效角色" }, { status: 400 });
      }

      const nicknameMap: Record<string, string> = {
        COLLECTOR: "采集者（开发）",
        VERIFIER: "核验者（开发）",
        ADMIN: "管理员（开发）",
      };

      // 查找或创建开发用户
      const user = await prisma.user.upsert({
        where: { openId: `dev-${body.devRole}` },
        update: { role },
        create: {
          openId: `dev-${body.devRole}`,
          nickname: nicknameMap[role],
          avatar: "",
          role,
        },
      });

      const token = signToken({ userId: user.id, role: user.role });
      const response = NextResponse.json({ user });
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 3600,
        path: "/",
      });
      return response;
    }

    // 微信 OAuth 登录流程
    const { code } = body;
    if (!code) {
      return Response.json({ error: "缺少 code 参数" }, { status: 400 });
    }

    // TODO: 配置 WECHAT_APP_ID 和 WECHAT_APP_SECRET 后启用
    // const { access_token, openid } = await getWeChatAccessToken(code);
    // const wxUser = await getWeChatUserInfo(access_token, openid);
    // const user = await prisma.user.upsert({
    //   where: { openId: openid },
    //   update: { nickname: wxUser.nickname, avatar: wxUser.headimgurl },
    //   create: { openId: openid, nickname: wxUser.nickname, avatar: wxUser.headimgurl },
    // });
    // const token = signToken({ userId: user.id, role: user.role });

    return Response.json({
      message: "微信登录待配置 WECHAT_APP_ID 和 WECHAT_APP_SECRET",
    });
  }

  if (route === "logout") {
    const response = NextResponse.json({ message: "已退出登录" });
    response.cookies.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  return Response.json({ error: "未知路由" }, { status: 404 });
}
