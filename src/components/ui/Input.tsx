"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm text-white/60">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full h-12 px-4 rounded-2xl
            bg-white/[0.04] border border-white/10
            text-white placeholder:text-white/30
            backdrop-blur-xl
            outline-none
            transition-all duration-200
            focus:border-[#F9DB9A]/40 focus:bg-white/[0.06]
            focus:shadow-[0_0_24px_rgba(249,219,154,0.1)]
            ${error ? "border-red-500/50" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
