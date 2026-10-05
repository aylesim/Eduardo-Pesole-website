"use client";

import { useState } from "react";
import ShowreelStage from "@/components/ShowreelStage";

type HomeARollProps = {
  brandName: string;
  roleLine: string;
  showreelUrl: string;
  showreelTitle: string;
  ctaLabel: string;
};

export default function HomeARoll({
  brandName,
  roleLine,
  showreelUrl,
  showreelTitle,
  ctaLabel,
}: HomeARollProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative min-h-[85svh] lg:min-h-[100svh]">
      <div className="page-gutter mx-auto grid max-w-[1536px] gap-8 py-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-end lg:gap-10 lg:py-10">
        <div className="order-1">
          <ShowreelStage
            url={showreelUrl}
            title={showreelTitle}
            ctaLabel={ctaLabel}
            playing={playing}
            onPlayingChange={setPlaying}
          />
        </div>
        <div className="order-2 flex flex-col justify-end gap-5 pb-2 lg:min-h-[42vh] lg:pb-6">
          <p className="font-meta">Showreel · 2025</p>
          <h1 className="type-display text-text">{brandName}</h1>
          <p className="font-meta">{roleLine}</p>
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
