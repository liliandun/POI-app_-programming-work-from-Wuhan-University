"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 弹窗 */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                w-full max-w-lg rounded-[28px] p-8
                bg-[linear-gradient(180deg,rgba(68,43,21,0.92),rgba(20,13,8,0.95))]
                border border-[rgba(249,219,154,0.18)]
                shadow-[0_32px_100px_rgba(0,0,0,0.6)]
                backdrop-blur-2xl
              "
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-white">{title}</h2>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
                  >
                    &#x2715;
                  </button>
                </div>
              )}
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
