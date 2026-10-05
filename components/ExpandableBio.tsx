"use client";

import { useState } from "react";

type ExpandableBioProps = {
  lead: string;
  full: string;
};

export default function ExpandableBio({ lead, full }: ExpandableBioProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xl leading-relaxed text-ink md:text-2xl">{lead}</p>
      {open ? (
        <p className="leading-relaxed text-muted whitespace-pre-wrap">{full}</p>
      ) : null}
      <button
        type="button"
        className="focus-ring cursor-pointer font-meta text-accent hover:text-ink"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide full bio" : "Read full bio"}
      </button>
    </div>
  );
}
