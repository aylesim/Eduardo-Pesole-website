"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LiteYouTube from "@/components/LiteYouTube";

type ShowreelStageProps = {
  url: string;
  title: string;
  ctaLabel?: string;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
};

export default function ShowreelStage({
  url,
  title,
  ctaLabel = "Play showreel",
  playing,
  onPlayingChange,
}: ShowreelStageProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-elevated">
      <AnimatePresence mode="wait" initial={false}>
        {!playing ? (
          <motion.div
            key="poster"
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: reduced ? 0.12 : 0.42,
              ease: [0.77, 0, 0.175, 1],
            }}
          >
            <LiteYouTube
              url={url}
              title={title}
              kind="youtube"
              ctaLabel={ctaLabel}
              onPlayIntent={() => onPlayingChange(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={
              reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }
            }
            animate={
              reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
            }
            transition={{
              duration: reduced ? 0.12 : 0.42,
              ease: [0.77, 0, 0.175, 1],
            }}
          >
            <LiteYouTube url={url} title={title} kind="youtube" autoPlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
