export default function Footer() {
  return (
    <footer className="bg-espresso text-sand">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-sand/20">
          {/* Brand */}
          <div>
            <p
              className="font-label text-wheat"
              style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}
            >
              San Diego, California
            </p>
            <h2
              className="font-display text-sand mb-3"
              style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              Seven Sixty Tallow
            </h2>
            <p className="text-sand/70 text-sm leading-relaxed">
              Built for the sun, surf, and dirt of the 760.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-label text-wheat mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Navigate</p>
            <ul className="space-y-2 text-sm text-sand/80">
              <li>
                <a href="#why-suet" className="hover:text-wheat transition-colors">
                  Why Suet?
                </a>
              </li>
              <li>
                <a href="#the-lineup" className="hover:text-wheat transition-colors">
                  The Lineup
                </a>
              </li>
              <li>
                <a href="#our-roots" className="hover:text-wheat transition-colors">
                  Our Roots
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-label text-wheat mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Basics</p>
            <ul className="space-y-2 text-sm text-sand/80">
              <li>Zero synthetic fragrances</li>
              <li>Zero chemical stabilizers</li>
              <li>No seed oils</li>
              <li>100% beef suet — never trim</li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-10">
          <p className="text-sand/50 text-xs leading-relaxed max-w-3xl mb-6">
            These statements have not been evaluated by the FDA. These products are not
            intended to diagnose, treat, cure, or prevent any disease. The Solar Defense
            Bar is a physical mineral barrier, not an FDA-rated SPF sunscreen. Perform a
            patch test prior to full application.
          </p>
          <p className="text-sand/40 text-xs">
            &copy; 2026 Seven Sixty Tallow. Built in San Diego, CA.
          </p>
        </div>
      </div>
    </footer>
  );
}
