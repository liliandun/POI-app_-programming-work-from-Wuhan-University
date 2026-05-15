/* ===== 角色枚举 ===== */
export type UserRole = "COLLECTOR" | "VERIFIER" | "ADMIN";

/* ===== POI 状态 ===== */
export type POIStatus =
  | "PENDING"    // 待审核
  | "APPROVED"   // 已通过
  | "FLAGGED"    // 已标记错误
  | "CORRECTED"  // 已修正
  | "REJECTED";  // 已驳回

/* ===== 核验状态 ===== */
export type VerificationStatus =
  | "PENDING"    // 待处理
  | "ACCEPTED"   // 采集者已接受
  | "REJECTED"   // 采集者已驳回
  | "DISPUTED";  // 有争议，需讨论

/* ===== 讨论状态 ===== */
export type DiscussionStatus = "OPEN" | "RESOLVED";

/* ===== 管理员裁决 ===== */
export type AdminDecision = "SUPPORT_COLLECTOR" | "SUPPORT_VERIFIER" | null;

/* ===== 消息类型 ===== */
export type MessageType = "ERROR_NOTIFY" | "RESULT_NOTIFY" | "SYSTEM";

/* ===== POI 分类 ===== */
export const POI_CATEGORIES = [
  "餐饮服务",
  "住宿服务",
  "购物服务",
  "交通设施",
  "金融服务",
  "医疗保健",
  "教育文化",
  "政府机构",
  "旅游景点",
  "商务写字楼",
  "休闲娱乐",
  "公共设施",
  "其他",
] as const;

export type POICategory = (typeof POI_CATEGORIES)[number];

/* ===== 数据模型接口 ===== */
export interface User {
  id: string;
  openId: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
}

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  longitude: number;
  latitude: number;
  address: string;
  photos: string[];
  status: POIStatus;
  collectorId: string;
  collector?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  poiId: string;
  poi?: POI;
  verifierId: string;
  verifier?: User;
  errorDescription: string;
  newPhotos: string[];
  newLongitude?: number;
  newLatitude?: number;
  newCategory?: POICategory;
  newDescription?: string;
  status: VerificationStatus;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  fromUser?: User;
  toUserId: string;
  toUser?: User;
  type: MessageType;
  content: string;
  poiId?: string;
  poi?: POI;
  isRead: boolean;
  createdAt: Date;
}

export interface Discussion {
  id: string;
  poiId: string;
  poi?: POI;
  verificationId: string;
  verification?: Verification;
  status: DiscussionStatus;
  adminDecision: AdminDecision;
  resolvedAt?: Date;
  createdAt: Date;
  messages?: DiscussionMessage[];
}

export interface DiscussionMessage {
  id: string;
  discussionId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: Date;
}
