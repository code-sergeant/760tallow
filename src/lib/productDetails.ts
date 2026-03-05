export interface ProductDetailData {
  tagline: string;
  fullDescription: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
}

export const productDetails: Record<string, ProductDetailData> = {
  'solar-defense-bar': {
    tagline: 'Physical mineral barrier for face and body.',
    fullDescription:
      'The Solar Defense Bar is built for people who spend real time outside. A blend of non-nano zinc oxide, rendered beef suet, cacao powder, and local San Diego beeswax creates a solid bar that goes on smooth, absorbs quickly, and doesn\'t leave the chalky white cast you\'d expect from mineral protection. Cacao powder is the key — it naturally offsets zinc\'s whitening effect while adding antioxidant support. The beeswax locks it all together and adds a breathable, water-resistant layer.',
    benefits: [
      'Non-nano zinc oxide mineral protection — no chemical UV filters',
      'Cacao powder reduces white cast and adds antioxidant support',
      'Local San Diego beeswax for water resistance and barrier protection',
      '100% beef suet base absorbs clean — never greasy',
      'Reef-safe and free of oxybenzone and octinoxate',
    ],
    ingredients:
      'Beef Tallow (Bos taurus, suet-rendered), Zinc Oxide (non-nano), Theobroma Cacao (Cacao) Powder, Cera Alba (Beeswax), Simmondsia Chinensis (Jojoba) Seed Oil.',
    howToUse:
      'Warm the bar between your palms for a few seconds, then apply directly to skin. A thin, even layer is all you need. Reapply after swimming or heavy sweating. Not an FDA-rated sunscreen — see label for full disclosure.',
  },

  'original-cream': {
    tagline: 'Pure suet whipped with first-press olive oil and organic jojoba.',
    fullDescription:
      'This is where it started. The Original Cream is a straightforward, no-filler moisturizer built around 100% rendered beef suet from pasture-raised cattle in Wyoming and California. We whip it with pesticide-free, first-press olive oil from Temecula — about 40 miles north of San Diego — and finish with organic jojoba to keep the texture light and skin-mimicking. No water, no emulsifiers, no preservatives. Just three ingredients working the way skin expects fat to work.',
    benefits: [
      'Suet is structurally similar to human sebum — absorbs clean, not greasy',
      'Naturally rich in fat-soluble vitamins A, D, E, and K',
      'First-press Temecula olive oil adds oleic acid and antioxidants',
      'Jojoba keeps texture balanced and shelf life long without preservatives',
      'Zero water — every gram is active ingredient',
    ],
    ingredients:
      'Beef Tallow (Bos taurus, suet-rendered), Olea Europaea (Olive) Fruit Oil, Simmondsia Chinensis (Jojoba) Seed Oil.',
    howToUse:
      'Scoop a small amount — less than you think you need. Warm between fingertips and press into skin rather than rubbing. Ideal after showering, before bed, or anytime skin feels tight. Works best on damp skin.',
  },

  'lip-nourishment-4-pack': {
    tagline: 'Zero-water, ultra-hydrating lip formula. Four to a pack.',
    fullDescription:
      'The Lip Nourishment is our most concentrated formula by surface area. No water means no need for preservatives, and no preservatives means the suet and beeswax can do their job uninterrupted. The result is a balm that rebuilds the lip barrier rather than just coating it. The 4-pack exists because once you use one, you\'ll want one in your car, your bag, your desk, and your bathroom.',
    benefits: [
      'Zero water — no preservatives, no fillers, no carriers',
      'Beeswax seals in moisture and protects against wind and cold',
      'Suet rebuilds the lip barrier rather than just coating the surface',
      'Neutral scent — no synthetic fragrance or essential oils',
      '4-pack because you\'ll lose the first three',
    ],
    ingredients:
      'Beef Tallow (Bos taurus, suet-rendered), Cera Alba (Beeswax), Simmondsia Chinensis (Jojoba) Seed Oil.',
    howToUse:
      'Apply directly to lips as needed. Works well as an overnight treatment — apply a generous layer before sleep. Use on dry cuticles, elbows, or any other rough patches.',
  },
};
