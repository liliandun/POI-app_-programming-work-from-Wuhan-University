"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import POIForm from "@/components/poi/POIForm";

export default function CreatePOIPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const data = {
        name: formData.get("name"),
        category: formData.get("category"),
        address: formData.get("address"),
        longitude: formData.get("longitude"),
        latitude: formData.get("latitude"),
        description: formData.get("description") || "",
        photos: [],
      };
      const res = await fetch("/api/poi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard/poi");
      } else {
        const err = await res.json();
        alert(err.error || "创建失败");
      }
    } catch {
      alert("请求失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-white">新建 POI</h1>
        <p className="mt-1 text-sm text-white/50">填写 POI 信息并上传照片</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard hover={false}>
          <POIForm onSubmit={handleSubmit} loading={loading} />
        </GlassCard>
      </motion.div>
    </div>
  );
}
