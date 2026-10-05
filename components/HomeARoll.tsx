"use client";

import { useState } from "react";
import ShowreelStage from "@/components/ShowreelStage";

type HomeARollProps = {
  roleLine: string;
  showreelUrl: string;
  showreelTitle: string;
  showreelPoster?: string | null;
  ctaLabel: string;
};

export default function HomeARoll({
  roleLine,
  showreelUrl,
  showreelTitle,
  showreelPoster,
  ctaLabel,
}: HomeARollProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative min-h-[100svh]">
      <div className="page-gutter mx-auto grid max-w-[1536px] gap-8 py-8 lg:min-h-[100svh] lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-10">
        <div className="order-1 lg:col-span-8">
          <ShowreelStage
            url={showreelUrl}
            title={showreelTitle}
            poster={showreelPoster}
            ctaLabel={ctaLabel}
            playing={playing}
            onPlayingChange={setPlaying}
          />
        </div>
        <div className="order-2 flex flex-col justify-end gap-4 pb-2 lg:col-span-4 lg:pb-6">
          <p className="font-meta">Showreel · 2025</p>
          <h1 className="type-h2 text-[clamp(1.25rem,2vw,1.75rem)] text-text">
            {roleLine}
          </h1>
          {!playing ? (
            <button
              type="button"
              className="btn-accent w-fit"
              onClick={() => setPlaying(true)}
            >
              {ctaLabel}
            </button>
          ) : null}
          <p className="type-body text-muted">
            Immersive sound for games, installations, film and music — Berlin.
          </p>
        </div>
      </div>
    </section>
  );
}
