interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  className?: string;
}

const badgeVariants = {
  default:
    "bg-white/10 text-white/70 border-white/10",
  success:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  warning:
    "bg-amber-500/15 text-amber-300 border-amber-500/25",
  error:
    "bg-red-500/15 text-red-300 border-red-500/25",
  info:
    "bg-sky-500/15 text-sky-300 border-sky-500/25",
  purple:
    "bg-[#AB59D7]/15 text-[#AB59D7] border-[#AB59D7]/25",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        text-xs font-medium rounded-full border
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
