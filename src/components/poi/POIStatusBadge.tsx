import Badge from "@/components/ui/Badge";
import type { POIStatus } from "@/types";

const statusConfig: Record<POIStatus, { label: string; variant: "success" | "warning" | "error" | "info" | "purple" }> = {
  PENDING: { label: "待审核", variant: "warning" },
  APPROVED: { label: "已通过", variant: "success" },
  FLAGGED: { label: "已标记错误", variant: "error" },
  CORRECTED: { label: "已修正", variant: "info" },
  REJECTED: { label: "已驳回", variant: "purple" },
};

export default function POIStatusBadge({ status }: { status: POIStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
