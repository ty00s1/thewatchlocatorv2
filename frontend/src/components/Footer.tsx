import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-bone mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="label text-bone/60 mb-3">London</p>
          <p className="text-sm leading-relaxed">
            11 Bruton Street<br />
            Mayfair, London W1J 6PY
          </p>
          <p className="text-sm mt-3">+44 (0) 207 629 5573</p>
          <p className="text-sm mt-1">By appointment only</p>
        </div>

        <div>
          <p className="label text-bone/60 mb-3">Discover</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-brass">Shop watches</Link></li>
            <li><Link href="/sell-your-watch" className="hover:text-brass">Sell your watch</Link></li>
            <li><Link href="/repairs" className="hover:text-brass">Watch repairs</Link></li>
            <li><Link href="/about" className="hover:text-brass">About</Link></li>
            <li><Link href="/contact" className="hover:text-brass">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="label text-bone/60 mb-3">Newsletter</p>
          <p className="text-sm text-bone/70 mb-3">
            Curated arrivals, private viewings, and rare finds — delivered monthly.
          </p>
          <form className="flex border border-bone/20">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-bone/40 focus:outline-none"
            />
            <button type="submit" className="label px-4 border-l border-bone/20 hover:bg-brass hover:text-ink transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center gap-4">
          <PaymentMethods />
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-bone/50">
            <span>© {new Date().getFullYear()} The Watch Locator</span>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-bone">Privacy</Link>
              <Link href="/terms" className="hover:text-bone">Terms</Link>
              <Link href="/cookies" className="hover:text-bone">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Visa />
      <Mastercard />
      <Amex />
      <ApplePay />
      <GooglePay />
      <Stripe />
    </div>
  );
}

function Pill({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center h-8 min-w-[52px] px-2.5 bg-white text-ink rounded-md shadow-sm"
    >
      {children}
    </span>
  );
}

function Visa() {
  return (
    <Pill label="Visa">
      <span className="font-bold italic text-[13px] tracking-tight text-[#1a1f71]">VISA</span>
    </Pill>
  );
}

function Mastercard() {
  return (
    <Pill label="Mastercard">
      <span className="relative inline-flex">
        <span className="block w-4 h-4 rounded-full bg-[#eb001b]" />
        <span className="block w-4 h-4 rounded-full bg-[#f79e1b] -ml-1.5 mix-blend-multiply" />
      </span>
    </Pill>
  );
}

function Amex() {
  return (
    <Pill label="American Express">
      <span className="font-bold text-[10px] tracking-tight text-white bg-[#006fcf] px-1.5 py-0.5 rounded-sm">AMEX</span>
    </Pill>
  );
}

function ApplePay() {
  return (
    <Pill label="Apple Pay">
      <span className="inline-flex items-center text-ink text-[12px] font-medium">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 mr-0.5" aria-hidden>
          <path d="M16.365 1.43c0 1.14-.43 2.226-1.158 3.005-.79.844-2.066 1.5-3.118 1.418-.13-1.115.41-2.265 1.137-2.99.797-.795 2.16-1.388 3.139-1.433zM20.5 17.27c-.39.9-.575 1.302-1.077 2.098-.7 1.108-1.687 2.488-2.91 2.5-1.087.011-1.367-.708-2.842-.7-1.475.008-1.78.713-2.87.702-1.222-.012-2.158-1.258-2.858-2.366-1.957-3.094-2.162-6.726-.955-8.658.857-1.372 2.21-2.175 3.483-2.175 1.293 0 2.107.71 3.176.71 1.037 0 1.668-.71 3.164-.71 1.13 0 2.327.617 3.182 1.685-2.797 1.534-2.342 5.526.507 6.914z"/>
        </svg>
        Pay
      </span>
    </Pill>
  );
}

function GooglePay() {
  return (
    <Pill label="Google Pay">
      <span className="inline-flex items-center text-[12px] font-medium">
        <span className="text-[#4285f4]">G</span>
        <span className="text-[#ea4335]">o</span>
        <span className="text-[#fbbc04]">o</span>
        <span className="text-[#4285f4]">g</span>
        <span className="text-[#34a853]">l</span>
        <span className="text-[#ea4335]">e</span>
        <span className="ml-1 text-ink">Pay</span>
      </span>
    </Pill>
  );
}

function Stripe() {
  return (
    <Pill label="Stripe">
      <span className="font-bold italic text-[12px] tracking-tight text-[#635bff]">stripe</span>
    </Pill>
  );
}
