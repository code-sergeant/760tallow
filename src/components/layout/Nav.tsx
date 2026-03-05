import { useState } from 'react';
import CartIcon from '@/components/ui/CartIcon';
import Button from '@/components/ui/Button';

const navLinks = [
  { label: 'Why Suet?', href: '#why-suet' },
  { label: 'The Lineup', href: '#the-lineup' },
  { label: 'Our Roots', href: '#our-roots' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-sand/95 backdrop-blur-sm border-b border-sage">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <a
          href="#"
          className="font-bold tracking-[0.12em] uppercase text-espresso text-sm whitespace-nowrap"
        >
          Seven Sixty Tallow
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-espresso transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA + cart */}
        <div className="flex items-center gap-3">
          <a href="#the-lineup" className="hidden sm:block">
            <Button size="sm">Shop the Goods</Button>
          </a>
          <CartIcon />

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-6 cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span
              className={`block h-0.5 bg-espresso transition-transform duration-200 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 bg-espresso transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 bg-espresso transition-transform duration-200 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-sage bg-sand px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-muted hover:text-espresso transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#the-lineup" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2">Shop the Goods</Button>
          </a>
        </nav>
      )}
    </header>
  );
}
