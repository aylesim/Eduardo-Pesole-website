"use client";

import { useState } from "react";

type ExpandableBioProps = {
  lead: string;
  full: string;
};

export default function ExpandableBio({ lead, full }: ExpandableBioProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-7">
      <p className="type-lead text-text">{lead}</p>
      {open ? (
        <div className="max-w-[60ch] space-y-5 text-muted">
          {full.split(/\n\n+/).map((para) => (
            <p key={para.slice(0, 32)} className="type-body whitespace-pre-wrap">
              {para}
            </p>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className="btn-text"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Close biography ↑" : "Full biography ↓"}
      </button>
    </div>
  );
}
