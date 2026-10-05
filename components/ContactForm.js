"use client";

import { useState } from "react";

export default function ContactForm({
  email,
  fields,
  submitLabel,
  successMessage,
}) {
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = data.get("First Name") || "";
    const last = data.get("Last Name") || "";
    const from = data.get("Email") || "";
    const message = data.get("Message") || "";
    const subject = encodeURIComponent(`Contact from ${first} ${last}`.trim());
    const body = encodeURIComponent(
      `From: ${first} ${last}\nEmail: ${from}\n\n${message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="contact-success">{successMessage}</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const isMessage = field === "Message";
        const name = field;
        return (
          <label key={field} className="contact-field">
            <span>{field}</span>
            {isMessage ? (
              <textarea name={name} rows={5} required />
            ) : (
              <input
                type={field === "Email" ? "email" : "text"}
                name={name}
                required={field === "Email" || field === "Message"}
              />
            )}
          </label>
        );
      })}
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
