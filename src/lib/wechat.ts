/**
 * 微信公众号工具模块 (Placeholder)
 *
 * 待配置以下环境变量后启用:
 * - WECHAT_APP_ID
 * - WECHAT_APP_SECRET
 * - WECHAT_TOKEN
 */

const WECHAT_APP_ID = process.env.WECHAT_APP_ID || "";
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || "";

/** 微信 OAuth: 用 code 换取 access_token 和 openid */
export async function getWeChatAccessToken(code: string) {
  // TODO: 调用微信接口
  // const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`;
  // const res = await fetch(url);
  // return res.json();

  console.log(`[WeChat] getAccessToken called with code: ${code}`);
  return { access_token: "", openid: "", placeholder: true };
}

/** 微信 OAuth: 获取用户信息 */
export async function getWeChatUserInfo(accessToken: string, openId: string) {
  // TODO: 调用微信接口
  // const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`;
  // const res = await fetch(url);
  // return res.json();

  console.log(`[WeChat] getUserInfo called for openId: ${openId}`);
  return {
    openid: openId,
    nickname: "微信用户",
    headimgurl: "",
    placeholder: true,
  };
}

/** 发送模板消息 (公众号推送通知) */
export async function sendTemplateMessage(
  toOpenId: string,
  templateId: string,
  data: Record<string, { value: string; color?: string }>,
  url?: string
) {
  // TODO: 需先获取公众号 access_token (非 OAuth access_token)
  // const accessToken = await getPublicAccessToken();
  // const res = await fetch(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     touser: toOpenId,
  //     template_id: templateId,
  //     url,
  //     data,
  //   }),
  // });
  // return res.json();

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
    first: { value: `采集者已处理您的核验意见` },
    keyword1: { value: poiName },
    keyword2: { value: result === "accepted" ? "已接受" : "已驳回" },
    remark: { value: "请登录系统查看详情" },
  });
}

/** 验证微信服务器签名 */
export function verifyWeChatSignature(
  token: string,
  signature: string | null,
  timestamp: string | null,
  nonce: string | null
): boolean {
  if (!signature || !timestamp || !nonce) return false;

  // TODO: 实现签名验证
  // const arr = [token, timestamp, nonce].sort();
  // const str = arr.join("");
  // const hash = crypto.createHash("sha1").update(str).digest("hex");
  // return hash === signature;

  return true; // 开发阶段直接通过
}
