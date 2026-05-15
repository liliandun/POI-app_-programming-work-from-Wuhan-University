"use client";

export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* 多层径向渐变背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(circle at 18% 85%, rgba(246, 115, 0, 0.28), transparent 34%)",
            "radial-gradient(circle at 76% -8%, rgba(249, 219, 154, 0.42), transparent 28%)",
            "radial-gradient(circle at 62% 22%, rgba(171, 89, 215, 0.10), transparent 24%)",
            "linear-gradient(180deg, #160d03 0%, #070604 46%, #100900 100%)",
          ].join(", "),
        }}
      />

      {/* 顶部金色聚光灯 */}
      <div
        className="absolute -top-56 right-[18%] h-[620px] w-[360px] -rotate-[8deg] opacity-55"
        style={{
          background:
            "linear-gradient(180deg, rgba(249,219,154,0.85), rgba(246,115,0,0.18), transparent)",
          filter: "blur(28px)",
        }}
      />

      {/* 细微颗粒纹理 */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 80%, transparent 100%)",
        }}
      />
    </div>
  );
}
