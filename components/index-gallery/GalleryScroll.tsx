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

const AUTOPLAY_CARDS_PER_SECOND = 0.2;
const AUTOPLAY_RESUME_MS = 2800;

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
  const resumeAt = useRef(0);

  const pauseAutoplay = useCallback(() => {
    resumeAt.current = performance.now() + AUTOPLAY_RESUME_MS;
  }, []);

  const setTarget = useCallback(
    (index: number) => {
      store.current.target = index;
    },
    [],
  );

  useEffect(() => {
    let last = performance.now();
    let lastActive = -1;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = store.current;
      if (now >= resumeAt.current) {
        s.target += AUTOPLAY_CARDS_PER_SECOND * dt;
      }
      const next = s.current + (s.target - s.current) * (1 - Math.exp(-dt * 3.2));
      s.velocity = (next - s.current) / Math.max(dt, 0.001);
      s.current = next;

      const active =
        count > 0 ? ((Math.round(next) % count) + count) % count : 0;
      if (active !== lastActive) {
        lastActive = active;
        setActiveIndex(active);
        onActiveChange?.(active);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [count, onActiveChange]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pauseAutoplay();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const magnitude = Math.min(1.15, Math.abs(delta) / 180);
      store.current.target += Math.sign(delta) * magnitude * 0.72;
      window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        store.current.target = Math.round(store.current.target);
      }, 180);
    };

    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp"
      ) {
        pauseAutoplay();
      }
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
      pauseAutoplay();
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      pauseAutoplay();
      if (touchY.current == null) return;
      const y = e.touches[0]?.clientY ?? touchY.current;
      const dy = touchY.current - y;
      touchY.current = y;
      store.current.target += dy / 280;
    };
    const onTouchEnd = () => {
      pauseAutoplay();
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
  }, [pauseAutoplay, setTarget]);

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
