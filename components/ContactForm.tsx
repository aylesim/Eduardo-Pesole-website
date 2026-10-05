"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  email: string;
  fields: string[];
  submitLabel: string;
  successMessage: string;
};

export default function ContactForm({
  email,
  fields,
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = String(data.get("First Name") || "");
    const last = String(data.get("Last Name") || "");
    const from = String(data.get("Email") || "");
    const message = String(data.get("Message") || "");
    const subject = encodeURIComponent(`Contact from ${first} ${last}`.trim());
    const body = encodeURIComponent(
      `From: ${first} ${last}\nEmail: ${from}\n\n${message}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="text-muted">{successMessage}</p>;
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const isMessage = field === "Message";
        return (
          <label key={field} className="flex flex-col gap-1.5 text-sm">
            <span className="font-meta text-muted">{field}</span>
            {isMessage ? (
              <textarea
                name={field}
                rows={5}
                required
                className="rounded-sm border border-line bg-surface px-3 py-2 font-[inherit] text-ink focus-ring"
              />
            ) : (
              <input
                type={field === "Email" ? "email" : "text"}
                name={field}
                required={field === "Email" || field === "Message"}
                className="rounded-sm border border-line bg-surface px-3 py-2 font-[inherit] text-ink focus-ring"
              />
            )}
          </label>
        );
      })}
      <button
        type="submit"
        className="focus-ring self-start cursor-pointer border border-accent bg-accent px-5 py-2.5 font-meta text-base hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
