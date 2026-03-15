import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-sand overflow-hidden">

      {/* Ghost "760" watermark — fills the right side */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 flex items-center pointer-events-none select-none"
        style={{ overflow: 'hidden' }}
      >
        <span
          className="font-display text-espresso"
          style={{
            fontSize: 'clamp(220px, 46vw, 720px)',
            fontWeight: 900,
            lineHeight: 1,
            opacity: 0.045,
            letterSpacing: '-0.05em',
            transform: 'translateX(10%)',
            display: 'block',
            whiteSpace: 'nowrap',
          }}
        >
          760
        </span>
      </div>

      {/* Thin top border */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-espresso/10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-10">
        <div style={{ maxWidth: '640px' }}>

          {/* Eyebrow */}
          <p
            className="font-label text-olive animate-fade-up"
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: '2rem',
              animationDelay: '80ms',
            }}
          >
            San Diego, California&ensp;/&ensp;Est. in the 760
          </p>

          {/* Main headline */}
          <h1
            className="font-display text-espresso animate-fade-up"
            style={{
              fontSize: 'clamp(56px, 9vw, 124px)',
              fontWeight: 900,
              lineHeight: 0.93,
              letterSpacing: '-0.025em',
              marginBottom: '1.75rem',
              animationDelay: '160ms',
            }}
          >
            Hard&shy;working
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 700,
                color: 'var(--color-muted)',
                opacity: 0.7,
              }}
            >
              Skin&nbsp;Care
            </em>
            <br />
            <span style={{ fontSize: '0.68em', fontWeight: 700 }}>
              for&nbsp;the&nbsp;Elements.
            </span>
          </h1>

          {/* Ocean accent rule */}
          <div
            className="animate-scale-in"
            style={{
              width: '52px',
              height: '3px',
              backgroundColor: 'var(--color-rust)',
              marginBottom: '2rem',
              animationDelay: '300ms',
            }}
          />

          {/* Body copy */}
          <p
            className="text-muted animate-fade-up"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.72,
              maxWidth: '460px',
              marginBottom: '2.5rem',
              animationDelay: '380ms',
            }}
          >
            Most tallow brands use cheap muscle fat. We use 100% rendered beef
            suet — a nutrient-dense internal fat that actually absorbs into your
            skin. No beefy smell, no industrial seed oils, just pure hydration for the sun,
            surf, and desert.
          </p>

          {/* CTA row */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row gap-4 items-start"
            style={{ animationDelay: '460ms' }}
          >
            <Button
              size="lg"
              onClick={() => {
                document.getElementById('the-lineup')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Grab Yours
            </Button>
            <a
              href="#why-suet"
              className="inline-flex items-center gap-2 text-muted font-semibold text-sm hover:text-espresso transition-colors"
              style={{ paddingTop: '14px', paddingBottom: '14px', letterSpacing: '0.03em' }}
            >
              Why suet matters
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="animate-fade-up flex flex-wrap gap-2 mt-8"
            style={{ animationDelay: '560ms' }}
          >
            {['Zero Synthetic Fragrances', 'Zero Chemical Stabilizers', 'No Industrial Seed Oils'].map((badge) => (
              <span
                key={badge}
                className="font-label text-muted"
                style={{
                  display: 'inline-block',
                  padding: '5px 14px',
                  border: '1px solid rgba(107,92,64,0.3)',
                  borderRadius: '999px',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
