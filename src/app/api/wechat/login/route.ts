import { NextResponse } from "next/server";
import { getOAuthUrl } from "@/lib/wechat";

// GET /api/wechat/login → 重定向到微信授权页
export async function GET() {
  const url = getOAuthUrl("login");
  return NextResponse.redirect(url);
}
