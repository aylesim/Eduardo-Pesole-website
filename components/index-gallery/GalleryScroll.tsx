"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type GalleryScrollState = {
  current: number;
  target: number;
  velocity: number;
};

type ScrollApi = {
  activeIndex: number;
  setTarget: (index: number) => void;
  count: number;
  store: MutableRefObject<GalleryScrollState>;
};

const ScrollCtx = createContext<ScrollApi | null>(null);

export function useGalleryScroll() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error("useGalleryScroll outside provider");
  return ctx;
}

type ProviderProps = {
  count: number;
  children: ReactNode;
  onActiveChange?: (index: number) => void;
};

export function GalleryScrollProvider({
  count,
  children,
  onActiveChange,
}: ProviderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const store = useRef<GalleryScrollState>({
    current: 0,
    target: 0,
    velocity: 0,
  });
  const rafRef = useRef(0);
  const touchY = useRef<number | null>(null);
  const snapTimer = useRef(0);

  const clampIndex = useCallback(
    (v: number) => Math.min(Math.max(v, 0), Math.max(count - 1, 0)),
    [count],
  );

  const setTarget = useCallback(
    (index: number) => {
      store.current.target = clampIndex(index);
    },
    [clampIndex],
  );

  useEffect(() => {
    let last = performance.now();
    let lastActive = -1;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = store.current;
      const next = s.current + (s.target - s.current) * (1 - Math.exp(-dt * 4.2));
      s.velocity = (next - s.current) / Math.max(dt, 0.001);
      s.current = next;

      const active = Math.round(next);
      if (active !== lastActive) {
        lastActive = active;
        setActiveIndex(active);
        onActiveChange?.(active);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onActiveChange]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const step = Math.sign(delta) * Math.min(1, Math.abs(delta) / 320);
      store.current.target = clampIndex(store.current.target + step * 0.55);
      window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        store.current.target = Math.round(store.current.target);
      }, 140);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setTarget(Math.round(store.current.target) + 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setTarget(Math.round(store.current.target) - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const y = e.touches[0]?.clientY ?? touchY.current;
      const dy = touchY.current - y;
      touchY.current = y;
      store.current.target = clampIndex(store.current.target + dy / 280);
    };
    const onTouchEnd = () => {
      touchY.current = null;
      store.current.target = Math.round(store.current.target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(snapTimer.current);
    };
  }, [clampIndex, setTarget]);

  const api = useMemo<ScrollApi>(
    () => ({
      activeIndex,
      setTarget,
      count,
      store,
    }),
    [activeIndex, setTarget, count],
  );

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
