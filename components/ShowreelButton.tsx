"use client";

import { useState } from "react";
import LiteYouTube from "@/components/LiteYouTube";

type ShowreelButtonProps = {
  url: string;
  label: string;
  ariaLabel: string;
};

export default function ShowreelButton({
  url,
  label,
  ariaLabel,
}: ShowreelButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="focus-ring inline-flex cursor-pointer items-center gap-2 border border-accent/50 px-4 py-2.5 font-meta text-accent transition-colors hover:bg-accent hover:text-base"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
      >
        <span aria-hidden>▶</span>
        {label}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/90 p-5"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <button
            type="button"
            className="focus-ring absolute top-5 right-5 cursor-pointer font-meta text-muted hover:text-ink"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <div className="w-full max-w-4xl">
            <LiteYouTube url={url} title={ariaLabel} kind="youtube" />
          </div>
        </div>
      ) : null}
    </>
  );
}
