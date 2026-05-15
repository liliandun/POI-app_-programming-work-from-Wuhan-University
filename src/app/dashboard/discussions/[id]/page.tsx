"use client";

import { use, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

interface DiscussionData {
  id: string;
  status: string;
  adminDecision: string | null;
  poi: { name: string; collector: { id: string; nickname: string } };
  verification: { errorDescription: string; verifier: { id: string; nickname: string } };
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; nickname: string; role: string };
  }>;
}

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<DiscussionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const loadData = useCallback(() => {
    fetch(`/api/discussions/${id}`)
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionId: id, content: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        loadData();
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  const handleArbitrate = async (decision: string) => {
    if (!confirm(`确定要做出裁决：${decision === "SUPPORT_COLLECTOR" ? "支持采集者" : "支持核验者"}？`)) return;
    const res = await fetch("/api/discussions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discussionId: id, decision }),
    });
    if (res.ok) {
      loadData();
    } else {
      const err = await res.json();
      alert(err.error || "操作失败");
    }
  };

  if (loading) return <div className="py-20 text-center text-white/30">加载中...</div>;
  if (!data) return <div className="py-20 text-center text-white/30">讨论不存在</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium text-white">
            {data.verification.errorDescription.slice(0, 20)}...
          </h1>
          <Badge variant={data.status === "OPEN" ? "warning" : "success"}>
            {data.status === "OPEN" ? "进行中" : "已解决"}
          </Badge>
          {data.adminDecision && (
            <Badge variant="purple">
              {data.adminDecision === "SUPPORT_COLLECTOR" ? "支持采集者" : "支持核验者"}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-white/40">
          关联 POI: {data.poi.name} | 讨论 ID: {id}
        </p>
      </motion.div>

      {/* 消息列表 */}
      <div className="space-y-4">
        {data.messages.map((msg, i) => {
          const isCollector = msg.user.role === "COLLECTOR";
          const isAdmin = msg.user.role === "ADMIN";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`flex ${isCollector ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isCollector ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white/40">{msg.user.nickname}</span>
                  <Badge variant={isAdmin ? "error" : isCollector ? "info" : "purple"}>
                    {isAdmin ? "管理员" : isCollector ? "采集者" : "核验者"}
                  </Badge>
                  <span className="text-xs text-white/20">{new Date(msg.createdAt).toLocaleString("zh-CN")}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAdmin
                      ? "bg-[#F67300]/15 border border-[#F67300]/20 text-white/80"
                      : isCollector
                        ? "bg-[#AB59D7]/15 border border-[#AB59D7]/20 text-white/80"
                        : "bg-white/[0.06] border border-white/[0.08] text-white/70"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 发送消息 */}
      {data.status === "OPEN" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard hover={false} padding="p-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="输入讨论内容..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
              <Button variant="primary" size="md" onClick={handleSend} disabled={sending}>
                {sending ? "发送中..." : "发送"}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* 管理员操作区 */}
      {data.status === "OPEN" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <GlassCard hover={false}>
            <h3 className="text-sm font-medium text-white mb-2">管理员仲裁</h3>
            <p className="text-xs text-white/40 mb-4">
              当双方无法达成共识时，管理员可进行最终裁决
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleArbitrate("SUPPORT_COLLECTOR")}>
                支持采集者
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleArbitrate("SUPPORT_VERIFIER")}>
                支持核验者
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
