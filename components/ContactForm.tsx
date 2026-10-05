"use client";

import { FormEvent, useState } from "react";
import type { ServiceOffer } from "@/lib/types";

type ContactFormProps = {
  email: string;
  fields: string[];
  submitLabel: string;
  successMessage: string;
  services?: ServiceOffer[];
};

function topicPrefill(services: ServiceOffer[]) {
  if (typeof window === "undefined") return "";
  const hash = window.location.hash;
  const query = hash.includes("?")
    ? hash.slice(hash.indexOf("?") + 1)
    : window.location.search.slice(1);
  const topic = new URLSearchParams(query).get("topic");
  if (!topic) return "";
  const service = services.find((s) => s.id === topic);
  return service ? `Inquiry: ${service.title}` : "";
}

export default function ContactForm({
  email,
  fields,
  submitLabel,
  successMessage,
  services = [],
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [message] = useState(() => topicPrefill(services));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = String(data.get("First Name") || "");
    const last = String(data.get("Last Name") || "");
    const from = String(data.get("Email") || "");
    const bodyMessage = String(data.get("Message") || "");
    const subject = encodeURIComponent(`Contact from ${first} ${last}`.trim());
    const body = encodeURIComponent(
      `From: ${first} ${last}\nEmail: ${from}\n\n${bodyMessage}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="text-muted">{successMessage}</p>;
  }

  return (
    <form className="grid grid-cols-2 gap-x-5 gap-y-8" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const isMessage = field === "Message";
        return (
          <label
            key={field}
            className={`flex flex-col gap-2 text-sm ${
              field === "Email" || isMessage ? "col-span-2" : "col-span-1"
            }`}
          >
            <span className="font-meta">{field}</span>
            {isMessage ? (
              <textarea
                name={field}
                rows={5}
                required
                defaultValue={message}
                className="resize-none border-0 border-b border-text bg-transparent px-0 py-3 font-[inherit] text-text outline-none focus:border-b-2"
              />
            ) : (
              <input
                type={field === "Email" ? "email" : "text"}
                name={field}
                required={field === "Email" || field === "Message"}
                className="border-0 border-b border-text bg-transparent px-0 py-3 font-[inherit] text-text outline-none focus:border-b-2"
              />
            )}
          </label>
        );
      })}
      <button type="submit" className="btn-ghost col-span-2 justify-self-start">
        {submitLabel} →
      </button>
    </form>
  );
}
