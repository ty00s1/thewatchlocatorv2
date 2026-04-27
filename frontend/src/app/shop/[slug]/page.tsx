import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/store-api";
import { AddToCartButton } from "./add-to-cart";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "./gallery";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const minor = product.prices.currency_minor_unit ?? 2;
  const price = (Number(product.prices.price) / 10 ** minor).toLocaleString("en-GB", {
    style: "currency",
    currency: product.prices.currency_code || "GBP",
  });

  const categorySlug = product.categories[0]?.slug;
  const related = categorySlug
    ? (await getProducts({ category: categorySlug, per_page: 5 }).catch(() => []))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <>
      <article className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} fallbackAlt={product.name} />

        <div className="md:sticky md:top-24 self-start">
          <p className="label text-ink/50 mb-2">{product.categories[0]?.name || "Watch"}</p>
          <h1 className="title text-3xl sm:text-4xl leading-tight mb-4">{product.name}</h1>
          <p className="text-xl text-ink mb-8">{price}</p>

          {product.short_description ? (
            <div
              className="prose prose-sm prose-neutral max-w-none mb-10 text-ink/80"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          ) : null}

          <AddToCartButton productId={product.id} disabled={!product.is_purchasable || !product.is_in_stock} />

          {!product.is_in_stock ? (
            <p className="label text-ruby mt-3">Currently unavailable — enquire for similar pieces.</p>
          ) : null}

          <ul className="mt-8 space-y-3 text-sm text-ink">
            <li className="flex items-center gap-3">
              <BadgeCheckIcon />
              <Link href="/price-match" className="underline underline-offset-4 decoration-ink/40 hover:decoration-ink">
                Price match promise
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <TruckIcon />
              <span>Free delivery on orders over £200</span>
            </li>
            <li className="flex items-center gap-3">
              <LockIcon />
              <span>Safe &amp; secure transaction</span>
            </li>
            <li className="flex items-center gap-3">
              <ReturnIcon />
              <Link href="/returns" className="underline underline-offset-4 decoration-ink/40 hover:decoration-ink">
                Returns policy
              </Link>
            </li>
          </ul>

          {product.description ? (
            <div className="mt-12 pt-10 border-t border-ink/10">
              <h2 className="label tracking-widest2 text-ink/60 mb-5">Description</h2>
              <div
                className="prose prose-sm prose-neutral max-w-none text-ink/80"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          ) : null}
        </div>
      </article>

      <TrustBadges />

      {related.length > 0 ? (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="title text-2xl sm:text-3xl">You may also like</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

const ICON = "w-5 h-5 shrink-0 text-ink";

function BadgeCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden>
      <path d="M12 2.5l1.9 1.6 2.5-.3.8 2.4 2.3 1-.3 2.5L21 12l-1.6 1.9.3 2.5-2.4.8-1 2.3-2.5-.3L12 20.5l-1.9-1.6-2.5.3-.8-2.4-2.3-1 .3-2.5L3 12l1.6-1.9-.3-2.5 2.4-.8 1-2.3 2.5.3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}
