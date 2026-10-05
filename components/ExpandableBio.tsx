"use client";

import { useState } from "react";

type ExpandableBioProps = {
  lead: string;
  full: string;
};

export default function ExpandableBio({ lead, full }: ExpandableBioProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[60ch] space-y-4">
      <p className="type-lead text-text">{lead}</p>
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
        className="btn-text text-muted hover:text-accent"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide full bio" : "Read more"}
      </button>
    </div>
  );
}
