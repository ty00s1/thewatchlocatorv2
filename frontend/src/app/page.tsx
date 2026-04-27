import { Hero } from "@/components/Hero";
import { ImageGrid, type GridCard } from "@/components/ImageGrid";
import { getProducts } from "@/lib/store-api";

export const dynamic = "force-dynamic";

const FALLBACK = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1600&q=80";

export default async function HomePage() {
  // Pull real product images from the WP catalog so the homepage showcases live inventory.
  const products = await getProducts({ per_page: 6 }).catch(() => []);
  const img = (i: number) => products[i]?.images?.[0]?.src || FALLBACK;

  const heroImage = img(0);

  // Editorial imagery (dramatic, dark) for the HoL-style grid.
  const cards: GridCard[] = [
    {
      label: "Modern Watches",
      href: "/shop?category=modern",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1800&q=80",
    },
    {
      label: "Vintage Watches",
      href: "/shop?category=vintage",
      image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1400&q=80",
    },
    {
      label: "The Brands",
      href: "/shop",
      image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1400&q=80",
    },
    {
      label: "Sell Your Watch",
      href: "/sell-your-watch",
      image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1800&q=80",
    },
    {
      label: "Watch Repairs",
      href: "/repairs",
      image: "https://images.unsplash.com/photo-1565728744382-61accd4aa148?auto=format&fit=crop&w=1800&q=80",
    },
    {
      label: "Contact",
      href: "/contact",
      image: "https://images.unsplash.com/photo-1495856458515-0637185db551?auto=format&fit=crop&w=1400&q=80",
    },
  ];


  return (
    <>
      <Hero
        topLabel="Mayfair · Est. 2014"
        tagline="Exquisite Collection of both Contemporary and Timeless Watches in Mayfair"
        bottomLabel="By Appointment · Worldwide"
        imageUrl={heroImage}
        videoUrl="https://thewatchlocator.com/wp-content/uploads/2023/06/The-Watch-Locator-Video_1080p.mp4"
      />

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
        <h2 className="title text-3xl sm:text-4xl leading-tight mb-6">
          A decade of curating fine timepieces
        </h2>
        <p className="text-ink/70 leading-relaxed max-w-2xl mx-auto">
          From rare vintage Patek Philippe to the latest Royal Oak, our Mayfair atelier sources, authenticates,
          and places watches with collectors worldwide. Whether you are buying, selling, or simply searching for
          something extraordinary, every enquiry is handled in person.
        </p>
      </section>

      <ImageGrid cards={cards} />
    </>
  );
}
