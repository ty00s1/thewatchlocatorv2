import Link from "next/link";
import type { WPProduct } from "@/lib/types";

export function ProductCard({ product }: { product: WPProduct }) {
  const img = product.images[0]?.src;
  const minor = product.prices.currency_minor_unit ?? 2;
  const price = (Number(product.prices.price) / 10 ** minor).toLocaleString("en-GB", {
    style: "currency",
    currency: product.prices.currency_code || "GBP",
  });

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-bone overflow-hidden mb-3">
        {img ? (
          <img
            src={img}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-ink/5" />
        )}
      </div>
      <h3 className="title text-base text-ink group-hover:text-ruby transition-colors leading-snug">
        {product.name}
      </h3>
      <p className="text-sm text-ink/70 mt-1">{price}</p>
    </Link>
  );
}
