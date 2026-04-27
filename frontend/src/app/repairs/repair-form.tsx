"use client";

import { useState, useTransition } from "react";

const SERVICES = [
  "Servicing",
  "Polishing Dents",
  "Repinning Jubilee Bracelet",
  "Repinning Oyster Bracelet",
  "Dial Reprint",
  "Battery Replacement",
  "Glass Replacement",
  "Strap Replacement",
  "Other / not sure",
];

export function RepairForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      brand: fd.get("brand"),
      reference: fd.get("reference"),
      model: fd.get("model"),
      box_papers: fd.get("box_papers"),
      service: fd.get("service"),
      notes: fd.get("notes"),
      website_url: fd.get("website_url"),
    };
    start(async () => {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Could not send — please try again.");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <p className="label text-brass mb-3">Thank you</p>
        <h2 className="serif-display text-2xl mb-3">Repair request received</h2>
        <p className="text-ink/70">We'll be in touch within 24 hours to arrange the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl mx-auto">
      <div className="sr-only" aria-hidden>
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-5">
        <legend className="label text-ink/50 mb-3">Your Details</legend>
        <Field name="name" label="Full name" required />
        <div className="grid grid-cols-2 gap-4">
          <Field name="phone" label="Phone" />
          <Field name="email" type="email" label="Email" />
        </div>
      </fieldset>

      <fieldset className="space-y-5 pt-4 border-t hairline">
        <legend className="label text-ink/50 mb-3">The Watch</legend>
        <div className="grid grid-cols-2 gap-4">
          <Field name="brand" label="Brand" />
          <Field name="reference" label="Reference" />
        </div>
        <Field name="model" label="Model number" />
        <label className="block">
          <span className="label block mb-2 text-ink/70">Service requested</span>
          <select
            name="service"
            className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink"
          >
            <option value="">Select…</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label block mb-2 text-ink/70">Do you have the box, papers, or service card?</span>
          <input
            name="box_papers"
            type="text"
            placeholder="e.g. Box and papers — yes; service card — no"
            className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="label block mb-2 text-ink/70">Additional information</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full border hairline bg-transparent p-3 text-ink focus:outline-none focus:border-ink"
          />
        </label>
      </fieldset>

      <p className="text-xs text-ink/50">
        For photos, please email or WhatsApp them after submitting this form — we'll reply with a quote.
      </p>

      {err ? <p className="label text-ruby">{err}</p> : null}

      <button
        disabled={pending}
        className="label tracking-widest2 w-full border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors disabled:opacity-40"
      >
        {pending ? "Sending…" : "Submit repair request"}
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
