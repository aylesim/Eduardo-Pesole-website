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
            <span>{field}</span>
            {isMessage ? (
              <textarea
                name={field}
                rows={5}
                required
                className="rounded-sm border border-line bg-white px-2.5 py-2 font-[inherit] text-ink"
              />
            ) : (
              <input
                type={field === "Email" ? "email" : "text"}
                name={field}
                required={field === "Email" || field === "Message"}
                className="rounded-sm border border-line bg-white px-2.5 py-2 font-[inherit] text-ink"
              />
            )}
          </label>
        );
      })}
      <button
        type="submit"
        className="self-start cursor-pointer border border-ink bg-ink px-5 py-2 font-[inherit] text-page hover:opacity-85"
      >
        {submitLabel}
      </button>
    </form>
  );
}
