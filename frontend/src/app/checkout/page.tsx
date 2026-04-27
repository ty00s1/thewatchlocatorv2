import { CheckoutForm } from "./checkout-form";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="text-center mb-12">
        <p className="label text-ink/50 mb-3">Secure Checkout</p>
        <h1 className="serif-display text-3xl tracking-widest2">Place Your Order</h1>
      </header>
      <CheckoutForm />
    </div>
  );
}
