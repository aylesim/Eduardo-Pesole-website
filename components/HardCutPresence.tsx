"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useClientReducedMotion } from "@/lib/use-client-reduced-motion";

const cutEase = [0.77, 0, 0.175, 1] as const;

export default function HardCutPresence({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useClientReducedMotion();

  // Index WebGL gallery owns the viewport — skip Hard Cut chrome here
  if (pathname === "/") {
    return <>{children}</>;
  }

  if (reduced) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(100% 0 0 0)" }}
        transition={{ duration: 0.48, ease: cutEase }}
        className="min-h-[70vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
