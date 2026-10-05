"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) {
      if (window.__lenis) {
        window.__lenis.destroy();
        delete window.__lenis;
      }
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.88,
      smoothWheel: true,
      syncTouch: false,
    });
    window.__lenis = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);

  return children;
}

export function oxideEase(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
