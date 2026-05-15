"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#100900]">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* lg 以上保持左侧 margin 给固定侧边栏让位 */}
      <div className="lg:ml-64">
        <DashboardHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
