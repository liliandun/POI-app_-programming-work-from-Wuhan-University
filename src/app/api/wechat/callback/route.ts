import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { getOAuthAccessToken } from "@/lib/wechat";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// GET /api/wechat/callback?code=xxx&state=login
// 微信授权后回调，用 code 换 openid，登录或注册用户
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  // 用户拒绝授权或缺少 code
  if (!code) {
    return NextResponse.redirect(`${BASE_URL}/login?error=no_code`);
  }

  try {
    // 1. 用 code 换取 openid
    const tokenResult = await getOAuthAccessToken(code);

    if (tokenResult.errcode || !tokenResult.openid) {
      console.error("[WeChat] OAuth failed:", tokenResult);
      return NextResponse.redirect(`${BASE_URL}/login?error=oauth_failed`);
    }

    const { openid } = tokenResult;

    // 2. 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { openId: openid },
    });

    if (!user) {
      // 新用户，默认角色为 COLLECTOR
      user = await prisma.user.create({
        data: {
          openId: openid,
          nickname: `用户${openid.slice(-6)}`,
          avatar: "",
          role: "COLLECTOR",
        },
      });
      console.log(`[WeChat] New user created: ${user.id} (${openid})`);
    }

    // 3. 签发 JWT，写入 HttpOnly Cookie
    const token = signToken({ userId: user.id, role: user.role });

    const response = NextResponse.redirect(`${BASE_URL}/dashboard`);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 3600, // 7 天
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[WeChat] Callback error:", err);
    return NextResponse.redirect(`${BASE_URL}/login?error=server_error`);
  }
}
