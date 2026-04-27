function BadgeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M24 4l4 3.5 5-1.5 2 4.7 5 1.4-1 5 3.5 4-3.5 4 1 5-5 1.4-2 4.7-5-1.5L24 44l-4-3.5-5 1.5-2-4.7-5-1.4 1-5-3.5-4 3.5-4-1-5 5-1.4 2-4.7 5 1.5z" />
      <polyline points="17,24 22,29 32,19" />
    </svg>
  );
}

function MoneyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="6" y="14" width="36" height="22" rx="2" />
      <circle cx="24" cy="25" r="5" />
      <line x1="12" y1="20" x2="12" y2="20.01" />
      <line x1="36" y1="30" x2="36" y2="30.01" />
    </svg>
  );
}

function CollectorsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="18" cy="18" r="6" />
      <path d="M6 40c0-7 5.5-12 12-12s12 5 12 12" />
      <circle cx="34" cy="14" r="5" />
      <path d="M28 28c2-1 4-1.5 6-1.5 6 0 10 4.5 10 11" />
    </svg>
  );
}

const ITEMS = [
  {
    Icon: BadgeIcon,
    title: "Authentication Guarantee",
    body:
      "Every watch comes with our certificate of authenticity, backed by our team of certified horologists and industry-leading inspection process.",
  },
  {
    Icon: MoneyIcon,
    title: "Competitive Pricing",
    body:
      "Our extensive network and industry relationships allow us to offer exceptional timepieces at competitive prices, ensuring outstanding value for collectors.",
  },
  {
    Icon: CollectorsIcon,
    title: "Trusted by Collectors",
    body:
      "Join thousands of satisfied collectors who have trusted The Watch Locator to source and authenticate their most prized timepieces.",
  },
];

export function TrustBadges() {
  return (
    <section className="max-w-6xl mx-auto px-6 grid gap-5 sm:grid-cols-3 my-20">
      {ITEMS.map(({ Icon, title, body }) => (
        <div
          key={title}
          className="bg-[#f4f1eb] rounded-md p-10 flex flex-col items-center text-center"
        >
          <Icon className="w-10 h-10 text-brass mb-6" />
          <h3 className="title text-xl text-ink mb-4">{title}</h3>
          <p className="text-sm text-ink/70 leading-relaxed">{body}</p>
        </div>
      ))}
    </section>
  );
}
