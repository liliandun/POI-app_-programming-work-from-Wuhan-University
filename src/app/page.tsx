"use client";

import { motion } from "framer-motion";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "POI 数据采集",
    desc: "上传照片、定位位置、分类标注，一站式完成 POI 数据采集",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "数据核验",
    desc: "核验者发现错误后标识并更新，系统自动通知采集者处理",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "地图可视化",
    desc: "在地图上按类别查看 POI 分布、错误标识与进展状态",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "讨论与仲裁",
    desc: "采集者与核验者在线讨论，无法达成共识时由管理员仲裁",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100900] text-white">
      <BackgroundEffects />
      <Header />

      {/* ===== Hero Section ===== */}
      <section className="relative z-10 grid min-h-screen items-center gap-14 px-6 pt-28 md:grid-cols-[1.05fr_0.95fr] md:px-20">
        {/* 左侧内容 */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow Pill */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#F9DB9A]/25 bg-[#F67300]/10 px-4 py-2 text-sm text-[#F9DB9A]/85 backdrop-blur-xl">
            &#x2726; POI 数据采集与核验平台
          </div>

          {/* 主标题 */}
          <h1 className="max-w-3xl text-[clamp(48px,7vw,108px)] font-medium leading-[0.95] tracking-[-0.06em]">
            <span className="text-metal">
              智慧数采
              <br />
              精准核验
              <br />
            </span>
            <span className="text-[#AB59D7]">
              {"{ "}
            </span>
            <span className="text-metal">协同平台</span>
            <span className="text-[#AB59D7]">
              {" }"}
            </span>
          </h1>

          {/* 描述 */}
          <p className="mt-7 max-w-md text-base leading-7 text-white/65">
            面向 POI 数据采集与核验的全流程协作平台，支持地图可视化、实时通知、在线讨论与管理员仲裁。
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/login">
              <Button variant="primary" size="lg">
                开始使用 &rarr;
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                了解功能
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 右侧代码卡片 */}
        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 主卡片 */}
          <div className="rounded-[28px] border border-[#F9DB9A]/20 bg-[#4b3018]/40 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
            {/* 窗口圆点 */}
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            {/* 代码内容 */}
            <pre className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-6 font-mono text-sm leading-7 text-white/70">
              {`const poi = await createPOI({
  name: "天安门广场",
  category: "旅游景点",
  location: {
    lng: 116.397128,
    lat: 39.916527,
  },
  photos: ["photo_001.jpg"],
  status: "PENDING",
});

// 核验者标记错误
await flagPOI(poi.id, {
  error: "位置坐标偏移",
  correctedLat: 39.916200,
});`}
            </pre>
          </div>

          {/* 浮动小卡片 */}
          <motion.div
            className="absolute -bottom-12 right-4 rounded-3xl border border-[#F9DB9A]/20 bg-[#3a2412]/70 p-6 shadow-[0_20px_80px_rgba(246,115,0,0.18)] backdrop-blur-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="font-mono text-sm text-white/70">
              <span className="text-[#AB59D7]">status</span>:{" "}
              <span className="text-emerald-400">&quot;verified&quot;</span>
              <br />
              <span className="text-[#AB59D7]">accuracy</span>:{" "}
              <span className="text-[#F9DB9A]">99.2%</span>
              <br />
              <span className="text-[#AB59D7]">poi_count</span>:{" "}
              <span className="text-[#F67300]">12,847</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="relative z-10 px-6 py-32 md:px-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
            <span className="text-metal">核心功能</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            从数据采集到核验审批，全流程覆盖
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_center,rgba(246,115,0,0.32),rgba(30,18,8,0.68))] border border-[#F9DB9A]/18 text-[#F9DB9A] shadow-[0_0_48px_rgba(246,115,0,0.30)]">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feat.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#AB59D7]/60" />
            <span>POI Collector</span>
          </div>
          <p>&copy; 2026 POI Collector. 课程设计项目</p>
        </div>
      </footer>
    </main>
  );
}
