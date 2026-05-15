"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface MessageItem {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  fromUser: { nickname: string };
  poi: { name: string } | null;
}

const typeConfig: Record<string, { label: string; variant: "error" | "info" | "default" }> = {
  ERROR_NOTIFY: { label: "错误通知", variant: "error" },
  RESULT_NOTIFY: { label: "处理结果", variant: "info" },
  SYSTEM: { label: "系统消息", variant: "default" },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((res) => setMessages(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMessages(); }, []);

  const handleMarkAllRead = async () => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    loadMessages();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-medium text-white">消息中心</h1>
          <p className="mt-1 text-sm text-white/50">查看系统通知与核验消息</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
          全部已读
        </Button>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-white/30">加载中...</div>
      ) : messages.length === 0 ? (
        <div className="py-20 text-center text-white/30">暂无消息</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const config = typeConfig[msg.type] || typeConfig.SYSTEM;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <GlassCard padding="p-5" className={!msg.isRead ? "border-[#F67300]/30" : ""}>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 shrink-0">
                      {!msg.isRead ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#F67300]" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        {msg.poi && (
                          <span className="text-xs text-[#F9DB9A]/60">{msg.poi.name}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{msg.content}</p>
                      <p className="mt-2 text-xs text-white/25">
                        {msg.fromUser.nickname} · {new Date(msg.createdAt).toLocaleString("zh-CN")}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
