"use client";

import { useState, useTransition } from "react";

const SUBJECTS = ["Buying a Watch", "Selling a Watch", "Watch Locator Service", "Private Viewing", "General Enquiry"];

export function ContactForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      website_url: fd.get("website_url"),
    };
    start(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Could not send.");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="py-12">
        <p className="label text-brass mb-3">Thank you</p>
        <h2 className="serif-display text-2xl mb-3">Message sent</h2>
        <p className="text-ink/70">We will be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="sr-only" aria-hidden>
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>
      <Field name="name" label="Your name" required />
      <Field name="email" type="email" label="Email" required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="phone" label="Phone" />
        <label className="block">
          <span className="label block mb-2 text-ink/70">Subject</span>
          <select name="subject" className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink">
            <option value="">Select…</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="label block mb-2 text-ink/70">Message *</span>
        <textarea name="message" required rows={5} className="w-full border hairline bg-transparent p-3 text-ink focus:outline-none focus:border-ink" />
      </label>

      {err ? <p className="label text-ruby">{err}</p> : null}

      <button disabled={pending} className="label tracking-widest2 w-full border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors disabled:opacity-40">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field(props: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="label block mb-2 text-ink/70">{props.label}{props.required ? " *" : ""}</span>
      <input
        name={props.name}
        type={props.type || "text"}
        required={props.required}
        className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink"
      />
    </label>
  );
}
