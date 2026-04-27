"use client";

import { useState, useTransition } from "react";

const BRANDS = ["Rolex", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "Vacheron Constantin", "A. Lange & Söhne", "Other"];
const CONDITIONS = ["Mint", "Excellent", "Very Good", "Good", "Fair"];
const INCLUDES_OPTIONS = ["Box", "Papers", "Manual", "Service receipts", "Spare links"];

export function SellForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const includes = INCLUDES_OPTIONS.filter((opt) => fd.get(`includes_${opt}`));
    const payload = {
      brand: fd.get("brand"),
      model: fd.get("model"),
      reference: fd.get("reference"),
      year: fd.get("year"),
      condition: fd.get("condition"),
      includes,
      notes: fd.get("notes"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
    };

    start(async () => {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Could not submit — please try again.");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <p className="label text-brass mb-3">Thank you</p>
        <h2 className="serif-display text-2xl mb-3">Submission received</h2>
        <p className="text-ink/70">We will be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset className="space-y-5">
        <legend className="label text-ink/50 mb-3">The Watch</legend>
        <div className="grid grid-cols-2 gap-4">
          <Select name="brand" label="Brand" options={BRANDS} required />
          <Field name="model" label="Model" required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field name="reference" label="Reference" />
          <Field name="year" label="Year" />
          <Select name="condition" label="Condition" options={CONDITIONS} required />
        </div>
        <div>
          <span className="label block mb-2 text-ink/70">What's included</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {INCLUDES_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-ink/80">
                <input type="checkbox" name={`includes_${opt}`} className="accent-ruby" />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="label block mb-2 text-ink/70">Notes</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full border hairline bg-transparent p-3 text-ink focus:outline-none focus:border-ink"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-5 pt-4 border-t hairline">
        <legend className="label text-ink/50 mb-3">Your Details</legend>
        <Field name="name" label="Full name" required />
        <div className="grid grid-cols-2 gap-4">
          <Field name="email" type="email" label="Email" required />
          <Field name="phone" label="Phone" />
        </div>
      </fieldset>

      {err ? <p className="label text-ruby">{err}</p> : null}

      <button
        disabled={pending}
        className="label tracking-widest2 w-full border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors disabled:opacity-40"
      >
        {pending ? "Sending…" : "Submit for valuation"}
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

function Select(props: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="label block mb-2 text-ink/70">{props.label}{props.required ? " *" : ""}</span>
      <select
        name={props.name}
        required={props.required}
        className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink"
      >
        <option value="">Select…</option>
        {props.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
