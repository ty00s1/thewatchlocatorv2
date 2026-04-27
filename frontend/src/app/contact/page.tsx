import { ContactForm } from "./contact-form";

export const metadata = { title: "Contact — The Watch Locator" };

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2">
      <div>
        <p className="label text-ink/50 mb-3">Visit Us</p>
        <h1 className="serif-display text-3xl tracking-widest2 mb-6">Contact</h1>
        <div className="space-y-5 text-ink/80">
          <p>11 Bruton Street<br />Mayfair, London W1J 6PY</p>
          <p>+44 (0) 207 629 5573<br />enquiries@thewatchlocator.com</p>
          <p className="label text-ink/50">By appointment, Monday – Saturday</p>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
