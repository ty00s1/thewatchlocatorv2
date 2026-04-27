"use client";

import { useState, useTransition } from "react";

export function CheckoutForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState<{ orderNumber?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: fd.get("first_name"),
      last_name: fd.get("last_name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address_1: fd.get("address_1"),
      city: fd.get("city"),
      postcode: fd.get("postcode"),
      country: fd.get("country") || "GB",
      payment_method: "bacs",
    };

    start(async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Could not place order.");
        return;
      }
      const j = await res.json();
      setDone({ orderNumber: j.order_number });
    });
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <p className="label text-brass mb-3">Thank you</p>
        <h2 className="serif-display text-2xl mb-4">Order received</h2>
        <p className="text-ink/70">
          Order {done.orderNumber ? <strong>{done.orderNumber}</strong> : null} has been placed. We will be in touch
          shortly with bank transfer details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field name="first_name" label="First name" required />
        <Field name="last_name" label="Last name" required />
      </div>
      <Field name="email" type="email" label="Email" required />
      <Field name="phone" label="Phone" />
      <Field name="address_1" label="Address" required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="city" label="City" required />
        <Field name="postcode" label="Postcode" required />
      </div>
      <Field name="country" label="Country (ISO 2)" defaultValue="GB" required />

      <p className="text-xs text-ink/50">
        Local development — payment is handled offline (BACS / by appointment). No card data is collected here.
      </p>

      {err ? <p className="label text-ruby">{err}</p> : null}

      <button
        disabled={pending}
        className="label tracking-widest2 w-full border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors disabled:opacity-40"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

function Field(props: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="label block mb-2 text-ink/70">{props.label}{props.required ? " *" : ""}</span>
      <input
        name={props.name}
        type={props.type || "text"}
        required={props.required}
        defaultValue={props.defaultValue}
        className="w-full border-b hairline bg-transparent py-2 text-ink focus:outline-none focus:border-ink"
      />
    </label>
  );
}
