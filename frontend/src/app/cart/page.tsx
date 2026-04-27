import Link from "next/link";
import { cookies } from "next/headers";
import { CartLine } from "./cart-line";

export const dynamic = "force-dynamic";

const WP = process.env.WP_API_URL || "http://wordpress";
const COOKIE = "twl_cart_token";

type Cart = {
  items: Array<{
    key: string;
    id: number;
    name: string;
    quantity: number;
    permalink: string;
    images: Array<{ src: string; alt: string }>;
    totals: { line_total: string; currency_code: string; currency_minor_unit: number };
  }>;
  items_count: number;
  totals: {
    total_price: string;
    currency_code: string;
    currency_minor_unit: number;
    currency_symbol: string;
  };
};

async function fetchCart(): Promise<Cart | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  const res = await fetch(`${WP}/wp-json/wc/store/v1/cart`, {
    headers: token ? { "Cart-Token": token } : {},
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

function formatMoney(minor: string, code: string, mu: number) {
  return (Number(minor) / 10 ** mu).toLocaleString("en-GB", { style: "currency", currency: code || "GBP" });
}

function slugFromPermalink(permalink: string, fallback: number) {
  const parts = permalink.split("/").filter(Boolean);
  return `/shop/${parts[parts.length - 1] || fallback}`;
}

export default async function CartPage() {
  const cart = await fetchCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="serif-display text-3xl tracking-widest2 mb-6">Your Cart</h1>
        <p className="text-ink/60 mb-8">No watches in your cart yet.</p>
        <Link href="/shop" className="label tracking-widest2 border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="serif-display text-3xl tracking-widest2 mb-10 text-center">Your Cart</h1>

      <div className="divide-y hairline border-t border-b hairline">
        {cart.items.map((item) => (
          <CartLine
            key={item.key}
            cartKey={item.key}
            name={item.name}
            quantity={item.quantity}
            image={item.images[0]?.src}
            permalink={slugFromPermalink(item.permalink, item.id)}
            lineTotal={formatMoney(item.totals.line_total, item.totals.currency_code, item.totals.currency_minor_unit)}
          />
        ))}
      </div>

      <div className="flex justify-between items-baseline mt-8">
        <span className="label">Total</span>
        <span className="serif-display text-2xl">
          {formatMoney(cart.totals.total_price, cart.totals.currency_code, cart.totals.currency_minor_unit)}
        </span>
      </div>

      <div className="mt-10 text-right">
        <Link
          href="/checkout"
          className="label tracking-widest2 inline-block border border-ink px-8 py-4 hover:bg-ink hover:text-bone transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
