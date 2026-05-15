import { NextRequest } from "next/server";
// import { verifyWeChatSignature, parseXml, buildReplyXml } from "@/lib/wechat";

// GET /api/wechat - 微信服务器验证
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const signature = searchParams.get("signature");
  const timestamp = searchParams.get("timestamp");
  const nonce = searchParams.get("nonce");
  const echostr = searchParams.get("echostr");

  // TODO: 验证微信签名
  // const token = process.env.WECHAT_TOKEN;
  // const isValid = verifyWeChatSignature(token, signature, timestamp, nonce);
  // if (isValid) return new Response(echostr);
  // return new Response("Invalid signature", { status: 403 });

  // 开发阶段直接返回 echostr
  return new Response(echostr || "wechat webhook ready");
}

// POST /api/wechat - 接收微信消息和事件
export async function POST(request: NextRequest) {
  const body = await request.text();

  // TODO: 解析微信推送的 XML 消息
  // const msg = parseXml(body);
  //
  // 处理不同类型的消息:
  // 1. 关注事件 (subscribe) - 发送欢迎消息
  // 2. 菜单点击事件 (CLICK) - 根据 EventKey 处理
  // 3. 文本消息 - 自动回复或转人工
  //
  // 示例: 用户关注时发送欢迎消息
  // if (msg.MsgType === "event" && msg.Event === "subscribe") {
  //   const reply = buildReplyXml(msg.FromUserName, msg.ToUserName, "text", {
  //     Content: "欢迎关注 POI Collector！点击下方菜单进入系统。",
  //   });
  //   return new Response(reply, { headers: { "Content-Type": "text/xml" } });
  // }

  return new Response("success");
}
