import type { FanScrollState } from "@/lib/fan";
import { createFanScroll } from "@/lib/fan";

export const fanScroll: FanScrollState = createFanScroll();

export function resetFanScroll() {
  fanScroll.current = 0;
  fanScroll.target = 0;
  fanScroll.grabbing = false;
}
