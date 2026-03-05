interface OriginPoint {
  location: string;
  description: string;
}

const origins: OriginPoint[] = [
  {
    location: 'Temecula, CA',
    description: 'Pesticide-free, first-press olive oil.',
  },
  {
    location: 'San Diego, CA',
    description: 'Wild-harvested local beeswax and honey.',
  },
  {
    location: 'Wyoming / California',
    description: 'Pasture-raised, 100% pure beef suet.',
  },
];

export default function Origins() {
  return (
    <section id="our-roots" className="bg-sage py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left: copy */}
          <div>
            <p
              className="font-label text-olive font-medium"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Supply Chain
            </p>
            <h2
              className="font-display text-espresso"
              style={{
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}
            >
              Local Roots.
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 700 }}>Zero Junk.</em>
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              We're based right here in the 760 and build our products using the
              best local ingredients we can get our hands on. If we wouldn't put
              it on our own skin, it doesn't go in the jar.
            </p>
          </div>

          {/* Right: origin points */}
          <div className="space-y-4">
            {origins.map((origin, index) => (
              <div
                key={origin.location}
                className="flex gap-5 items-start p-5 rounded-xl bg-sand"
                style={{ borderLeft: '3px solid var(--color-wheat)' }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-wheat text-espresso flex items-center justify-center font-bold"
                  style={{ fontFamily: 'var(--font-family-label)', fontSize: '12px' }}
                >
                  0{index + 1}
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">{origin.location}</p>
                  <p className="text-muted text-sm leading-relaxed">{origin.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
