import { SellForm } from "./sell-form";

export const metadata = { title: "Sell Your Watch — The Watch Locator" };

export default function SellYourWatchPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="text-center mb-10">
        <p className="label text-ink/50 mb-3">Consignment</p>
        <h1 className="serif-display text-3xl tracking-widest2 mb-5">Sell Your Watch</h1>
        <p className="text-ink/70 leading-relaxed">
          Tell us about your watch and we will respond within 24 hours with a free, no-obligation valuation. Trusted by
          collectors across Europe and the United States.
        </p>
      </header>
      <SellForm />
    </div>
  );
}
