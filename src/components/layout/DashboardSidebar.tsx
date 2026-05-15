"use client";

import Sidebar from "@/components/ui/Sidebar";

const sidebarItems = [
  {
    label: "概览",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "POI 管理",
    href: "/dashboard/poi",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "核验审批",
    href: "/dashboard/verify",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "地图视图",
    href: "/dashboard/map",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "消息中心",
    href: "/dashboard/messages",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "讨论",
    href: "/dashboard/discussions",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "管理仲裁",
    href: "/dashboard/admin",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  return <Sidebar items={sidebarItems} open={open} onClose={onClose} />;
}
