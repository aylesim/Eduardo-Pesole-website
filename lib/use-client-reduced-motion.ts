"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function useClientReducedMotion() {
  const prefersReduced = useReducedMotion() === true;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReduced);
  }, [prefersReduced]);

  return reduced;
}
