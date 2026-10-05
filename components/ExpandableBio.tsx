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
      <p className="type-body text-xl leading-relaxed text-text md:text-2xl md:leading-relaxed">
        {lead}
      </p>
      {open ? (
        <div className="space-y-4 text-muted">
          {full.split(/\n\n+/).map((para) => (
            <p key={para.slice(0, 32)} className="type-body whitespace-pre-wrap">
              {para}
            </p>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className="cursor-pointer font-meta text-primary hover:text-text"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide full bio" : "Read full bio +"}
      </button>
    </div>
  );
}
