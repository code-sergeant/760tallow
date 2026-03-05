import type { CSSProperties } from 'react';

interface ComparisonRow {
  attribute: string;
  them: string;
  us: string;
}

const rows: ComparisonRow[] = [
  {
    attribute: 'The Source',
    them: 'Leftover exterior muscle and hide trimmings.',
    us: '100% premium internal kidney fat.',
  },
  {
    attribute: 'The Smell',
    them: 'Carries a distinct "beefy" odor that brands try to cover up with heavy essential oils.',
    us: 'Naturally neutral and completely odorless.',
  },
  {
    attribute: 'The Feel',
    them: 'Softer, greasy, and tends to sit on top of the skin without fully absorbing.',
    us: 'Firm in the jar, melts on contact, and mimics your skin\'s natural oils so it absorbs clean.',
  },
  {
    attribute: 'Shelf Life',
    them: 'Higher moisture content means it goes bad (rancid) much faster.',
    us: 'Naturally packed with fat-soluble vitamins A, D, E, and K to rebuild weather-beaten skin.',
  },
];

const labelStyle: CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontWeight: 500,
};

const attrStyle: CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 500,
};

export default function Differentiator() {
  return (
    <section id="why-suet" className="bg-sage py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-14">
          <p
            className="font-label text-olive"
            style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '1.25rem' }}
          >
            The BIG FAT Difference
          </p>
          <h2
            className="font-display text-espresso"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em', maxWidth: '600px', marginBottom: '1.25rem' }}
          >
            The Suet Upgrade:<br />
            <em className="italic font-bold">Why Your Fat Source Matters</em>
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            If your current tallow smells like a burger joint or feels like greasy wax,
            it's probably made from "trim" — the leftover fat from steaks. We strictly use
            suet (internal kidney fat). Harder to source, but it makes a massive difference
            in how it feels and works on your skin.
          </p>
        </div>

        {/* ── Mobile: stacked cards ───────────────────────────────── */}
        <div className="md:hidden space-y-3">
          {rows.map((row) => (
            <div key={row.attribute} className="rounded-xl overflow-hidden border border-espresso/10">
              {/* Attribute label */}
              <div className="bg-espresso/6 px-4 py-2.5">
                <span className="font-label text-muted" style={attrStyle}>
                  {row.attribute}
                </span>
              </div>
              {/* Them */}
              <div className="px-4 py-3.5 border-b border-espresso/8">
                <p className="font-label text-muted mb-1.5" style={labelStyle}>
                  The Other Guys — Trim Fat
                </p>
                <p className="text-sm text-muted leading-relaxed">{row.them}</p>
              </div>
              {/* Us */}
              <div className="px-4 py-3.5 bg-rust/5" style={{ borderLeft: '3px solid var(--color-rust)' }}>
                <p className="font-label text-rust mb-1.5" style={labelStyle}>
                  Seven Sixty — Suet
                </p>
                <p className="text-sm text-espresso font-medium leading-relaxed">{row.us}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: table ──────────────────────────────────────── */}
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-28 pb-5 text-left" />
                <th className="pb-5 px-6 text-left w-[38%]">
                  <div className="rounded-xl bg-espresso/6 px-5 py-4">
                    <p className="font-label text-muted" style={{ ...labelStyle, marginBottom: '4px' }}>
                      The Other Guys
                    </p>
                    <p className="font-display text-espresso font-bold" style={{ fontSize: '18px' }}>Trim Fat</p>
                  </div>
                </th>
                <th className="pb-5 px-6 text-left w-[38%]">
                  <div className="rounded-xl bg-rust/8 px-5 py-4" style={{ borderLeft: '3px solid var(--color-rust)' }}>
                    <p className="font-label text-rust" style={{ ...labelStyle, marginBottom: '4px' }}>
                      Seven Sixty
                    </p>
                    <p className="font-display text-espresso font-bold" style={{ fontSize: '18px' }}>Suet</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/8">
              {rows.map((row) => (
                <tr key={row.attribute}>
                  <td className="py-5 pr-4 align-top">
                    <span className="font-label text-muted" style={attrStyle}>{row.attribute}</span>
                  </td>
                  <td className="py-5 px-6 align-top text-sm text-muted leading-relaxed">
                    {row.them}
                  </td>
                  <td
                    className="py-5 px-6 align-top text-sm text-espresso leading-relaxed font-medium"
                    style={{ borderLeft: '3px solid rgba(155,61,19,0.2)' }}
                  >
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
