import Link from "next/link";

export type GridCard = {
  label: string;
  href: string;
  image: string;
};

function Card({ card, wide }: { card: GridCard; wide?: boolean }) {
  const aspectClass = wide ? "aspect-[16/9]" : "h-full min-h-[260px]";
  return (
    <Link
      href={card.href}
      className={`group relative block overflow-hidden ${aspectClass}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${card.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/60 to-ink/75 group-hover:from-ink/65 group-hover:to-ink/85 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="serif-display text-bone text-lg sm:text-2xl tracking-widest2 text-center px-4"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          {card.label}
        </span>
      </div>
    </Link>
  );
}

export function ImageGrid({ cards }: { cards: GridCard[] }) {
  if (cards.length < 6) {
    return (
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {cards.map((c) => <Card key={c.label} card={c} wide />)}
      </section>
    );
  }

  const [c1, c2, c3, c4, c5, c6] = cards;
  return (
    <section className="max-w-7xl mx-auto px-6 space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="sm:col-span-2"><Card card={c1} wide /></div>
        <div className="sm:col-span-1"><Card card={c2} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="sm:col-span-1"><Card card={c3} /></div>
        <div className="sm:col-span-2"><Card card={c4} wide /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="sm:col-span-2"><Card card={c5} wide /></div>
        <div className="sm:col-span-1"><Card card={c6} /></div>
      </div>
    </section>
  );
}
