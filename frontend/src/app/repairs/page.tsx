import { RepairForm } from "./repair-form";

export const metadata = { title: "Watch Repairs — The Watch Locator" };

const SERVICES: Array<[string, string]> = [
  ["Repinning Jubilee Bracelet", "£225"],
  ["Repinning Oyster Bracelet", "£350"],
  ["Polishing Dents", "from £100"],
  ["Servicing", "from £100"],
  ["Dial Reprint", "£70"],
  ["Battery Replacement", "£70"],
];

export default function RepairsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-12">
        <p className="label text-ink/50 mb-3">Atelier Services</p>
        <h1 className="serif-display text-3xl sm:text-4xl tracking-widest2 mb-6">Watch Repairs</h1>
        <p className="text-ink/70 max-w-2xl mx-auto leading-relaxed">
          We carry out all types of watch repairs in our Mayfair atelier. A few of our most popular
          services are listed below. To book a repair, complete the form or call us directly — please
          have your watch details to hand.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="label text-ink/50 mb-4 text-center">Popular Services</h2>
        <div className="border-t border-b hairline divide-y hairline">
          {SERVICES.map(([service, price]) => (
            <div key={service} className="flex justify-between items-baseline py-4">
              <span className="text-ink">{service}</span>
              <span className="serif-display tracking-wider2 text-ink/80">{price}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/50 mt-4 text-center">
          Indicative pricing — final quote provided after we've seen the watch.
        </p>
      </section>

      <section className="grid gap-12 md:grid-cols-2 mb-16">
        <div>
          <p className="label text-ink/50 mb-3">Direct</p>
          <h3 className="serif-display text-xl tracking-wider2 mb-4">Speak to us</h3>
          <ul className="space-y-2 text-ink/80 text-sm">
            <li>WhatsApp / phone: <a href="tel:+447454005616" className="hover:text-ruby">0745 4005 616</a></li>
            <li>Email: <a href="mailto:thewatchlocator@gmail.com" className="hover:text-ruby">thewatchlocator@gmail.com</a></li>
            <li className="label text-ink/50 pt-2">Mon – Sat, by appointment</li>
          </ul>
        </div>
        <div>
          <p className="label text-ink/50 mb-3">What to send</p>
          <h3 className="serif-display text-xl tracking-wider2 mb-4">Repair information</h3>
          <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
            <li>Name and contact number</li>
            <li>Watch brand, reference, and model (if known)</li>
            <li>Whether you have the box, papers, or service card</li>
            <li>Photos of the watch</li>
            <li>Any additional information</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="serif-display text-2xl tracking-widest2 mb-8 text-center">Request a Repair</h2>
        <RepairForm />
      </section>
    </div>
  );
}
