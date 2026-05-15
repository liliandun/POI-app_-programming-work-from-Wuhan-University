/**
 * 微信公众号工具模块
 */

import crypto from "crypto";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID || "";
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * 生成微信 OAuth2 授权 URL
 * scope: snsapi_base 静默授权，只获取 openid
 */
export function getOAuthUrl(state = "login"): string {
  const redirectUri = encodeURIComponent(`${BASE_URL}/api/wechat/callback`);
  return (
    `https://open.weixin.qq.com/connect/oauth2/authorize` +
    `?appid=${WECHAT_APP_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=snsapi_base` +
    `&state=${state}` +
    `#wechat_redirect`
  );
}

/**
 * 用 code 换取 access_token + openid
 */
export async function getOAuthAccessToken(code: string): Promise<{
  access_token: string;
  openid: string;
  errcode?: number;
  errmsg?: string;
}> {
  const url =
    `https://api.weixin.qq.com/sns/oauth2/access_token` +
    `?appid=${WECHAT_APP_ID}` +
    `&secret=${WECHAT_APP_SECRET}` +
    `&code=${code}` +
    `&grant_type=authorization_code`;

  const res = await fetch(url);
  return res.json();
}

/**
 * 用 snsapi_userinfo scope 获取用户信息
 * 当前使用 snsapi_base 不调用此函数，保留以备升级
 */
export async function getUserInfo(accessToken: string, openid: string): Promise<{
  openid: string;
  nickname: string;
  headimgurl: string;
  errcode?: number;
  errmsg?: string;
}> {
  const url =
    `https://api.weixin.qq.com/sns/userinfo` +
    `?access_token=${accessToken}` +
    `&openid=${openid}` +
    `&lang=zh_CN`;

  const res = await fetch(url);
  return res.json();
}

/** 验证微信服务器签名 */
export function verifyWeChatSignature(
  token: string,
  signature: string | null,
  timestamp: string | null,
  nonce: string | null
): boolean {
  if (!signature || !timestamp || !nonce) return false;

  const arr = [token, timestamp, nonce].sort();
  const str = arr.join("");
  const hash = crypto.createHash("sha1").update(str).digest("hex");
  return hash === signature;
}

/** 发送模板消息 (公众号推送通知) */
export async function sendTemplateMessage(
  toOpenId: string,
  templateId: string,
  data: Record<string, { value: string; color?: string }>,
  url?: string
) {
  console.log(`[WeChat] sendTemplateMessage to ${toOpenId}, template: ${templateId}`);
  return { errcode: 0, errmsg: "placeholder", msgid: 0 };
}

/** 发送错误通知给采集者 */
export async function notifyCollectorError(collectorOpenId: string, poiName: string, errorDesc: string) {
  return sendTemplateMessage(collectorOpenId, "ERROR_TEMPLATE_ID", {
    first: { value: "您采集的 POI 数据被标记为错误" },
    keyword1: { value: poiName },
    keyword2: { value: errorDesc },
    remark: { value: "请登录系统查看并处理" },
  });
}

/** 发送处理结果通知给核验者 */
export async function notifyVerifierResult(
  verifierOpenId: string,
  poiName: string,
  result: "accepted" | "rejected"
) {
  return sendTemplateMessage(verifierOpenId, "RESULT_TEMPLATE_ID", {
    first: { value: "采集者已处理您的核验意见" },
    keyword1: { value: poiName },
    keyword2: { value: result === "accepted" ? "已接受" : "已驳回" },
    remark: { value: "请登录系统查看详情" },
  });
}
