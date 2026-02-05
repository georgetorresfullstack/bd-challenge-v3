"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddToBagButtonProps {
  disabled?: boolean;
  onAdd?: () => void;
  className?: string;
}

export function AddToBagButton({ disabled, onAdd, className = "" }: AddToBagButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async () => {
    if (disabled || status !== "idle") return;

    setStatus("loading");
    
    const delay = Math.floor(Math.random() * 400) + 800;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    setStatus("success");
    onAdd?.();

    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      className={`
        relative overflow-hidden w-full py-4 rounded-xl font-semibold transition-all duration-300
        ${disabled 
          ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600" 
          : status === "success"
            ? "bg-green-500 text-white cursor-default"
            : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 active:scale-[0.98]"
        }
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            Add to bag
          </motion.span>
        )}
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Added</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
