"use client";

import { useState } from "react";
import ShowreelDialog from "@/components/ShowreelDialog";

type LandingBeatProps = {
  brandName: string;
  roleLine: string;
  showreelUrl: string;
  showreelTitle: string;
  email: string;
};

export default function LandingBeat({
  brandName,
  roleLine,
  showreelUrl,
  showreelTitle,
  email,
}: LandingBeatProps) {
  const [open, setOpen] = useState(false);
  const parts = brandName.split(" ");
  const first = parts[0] ?? brandName;
  const rest = parts.slice(1).join(" ");

  return (
    <section className="page-gutter relative mx-auto flex min-h-[72svh] max-w-[1536px] flex-col justify-end pb-16 pt-20 md:pb-20">
      <h1 className="type-hero mb-5 text-text">
        <span className="block sm:inline">{first}</span>
        {rest ? (
          <>
            <span className="hidden sm:inline"> </span>
            <span className="block sm:inline">{rest}</span>
          </>
        ) : null}
      </h1>
      <p className="font-meta mb-6">{roleLine}</p>
      <div className="flex flex-wrap items-center gap-6">
        <ShowreelDialog
          open={open}
          onOpenChange={setOpen}
          url={showreelUrl}
          title={showreelTitle}
          triggerLabel="Showreel"
        />
        <a href={`mailto:${email}`} className="btn-text">
          Mail
        </a>
      </div>
      <p
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[clamp(16px,4vw,48px)] hidden origin-center -translate-y-1/2 rotate-[-90deg] font-meta lg:block"
      >
        Scroll for work
      </p>
    </section>
  );
}
