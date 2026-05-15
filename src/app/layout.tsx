import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POI Collector - 数据采集与核验平台",
  description: "POI 数据采集与核验系统，支持采集、核验、地图展示、讨论与导航",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#100900] text-white">
        {children}
      </body>
    </html>
  );
}
