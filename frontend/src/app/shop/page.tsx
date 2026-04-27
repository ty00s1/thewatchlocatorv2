import { ProductCard } from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/store-api";

export const revalidate = 60;

type SP = { category?: string; search?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ per_page: 24, category: sp.category, search: sp.search }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <p className="label text-ink/50 mb-3">The Collection</p>
        <h1 className="serif-display text-3xl sm:text-4xl tracking-widest2">All Watches</h1>
      </header>

      {categories.length > 0 ? (
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 label mb-12 text-ink/70">
          <a href="/shop" className={!sp.category ? "text-ruby" : "hover:text-ruby"}>All</a>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={sp.category === c.slug ? "text-ruby" : "hover:text-ruby"}
            >
              {c.name}
            </a>
          ))}
        </nav>
      ) : null}

      {products.length === 0 ? (
        <p className="text-center text-ink/60 py-16">No watches found in this collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
