export type FanScrollState = {
  current: number;
  target: number;
  grabbing: boolean;
};

export const FAN = {
  x: 1.15,
  y: 0.85,
  yPastExtra: 0.45,
  z: 2.4,
  scaleFactor: 0.55,
  nearestScale: 1.35,
  planeH: 3.2,
  planeW: 2.56,
  radius: 0.2048,
  damp: 4.2,
  wheelScale: 0.0022,
  touchScale: 0.0045,
  visibleMin: -1.2,
  visibleMaxDesktop: 12,
  visibleMaxMobile: 8,
} as const;

export function createFanScroll(initial = 0): FanScrollState {
  return { current: initial, target: initial, grabbing: false };
}

export function clampScroll(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(Math.max(value, 0), max);
}

export function fanOpacity(t: number) {
  if (t >= 0) {
    if (t <= 0.15) return 1;
    if (t >= 11) return 0;
    if (t < 6) return 1 - (t / 6) * 0.65;
    return Math.max(0, 0.35 * (1 - (t - 6) / 5));
  }
  const a = Math.abs(t);
  if (a <= 0.05) return 1;
  if (a >= 1.2) return 0;
  return Math.max(0, 1 - a * 0.85);
}

export function fanTransform(t: number) {
  const scale =
    FAN.nearestScale / (1 + Math.max(t, 0) * FAN.scaleFactor);
  const x = t * FAN.x;
  const y =
    t * FAN.y + (t < 0 ? t * FAN.yPastExtra : 0) - (t <= 0.15 ? 0.55 : 0);
  const z = -t * FAN.z;
  return { x, y, z, scale, opacity: fanOpacity(t) };
}
