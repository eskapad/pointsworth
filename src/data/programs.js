// Valuation dataset — August 2026.
// All values stored as USD per point (low / median / high). The UI converts
// to AED / SAR / QAR using the fixed USD pegs.
//
// Methodology: airline ranges are anchored on published expert valuations
// (NerdWallet, WalletHub, AwardFares, point.me, Upgraded Points) plus modelled
// redemption scenarios (miles + fees vs. the cash fare on the same flight).
// Bank ranges are anchored on the banks' own published redemption rates and
// on transfer ratios into airline programmes.
// cpp = US cents per point.

export const COUNTRIES = {
  AE: { name: 'UAE', flag: '🇦🇪' },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦' },
  QA: { name: 'Qatar', flag: '🇶🇦' },
  BH: { name: 'Bahrain', flag: '🇧🇭' },
  KW: { name: 'Kuwait', flag: '🇰🇼' },
  TR: { name: 'Türkiye', flag: '🇹🇷' },
}

export const AS_OF = 'August 2026'

export const PROGRAMS = [
  // ─────────────── Airlines ───────────────
  {
    id: 'emirates-skywards',
    name: 'Emirates Skywards',
    owner: 'Emirates',
    type: 'airline',
    country: 'AE',
    unit: 'mile',
    homeCurrency: 'AED',
    usd: { low: 0.005, median: 0.011, high: 0.02 },
    confidence: 'high',
    blurb:
      'Dynamic pricing means value swings widely. Classic Rewards in premium cabins are the sweet spot; merchandise and Skywards Everyday sit at the bottom. May 2026 devaluation: premium-cabin Classic and Upgrade Rewards rose ~15% (economy unchanged), softened by a new one-way Business Saver at 50% of return pricing.',
    bands: {
      low: 'Skywards Everyday, merchandise, poorly-priced dynamic awards',
      median: 'Economy Classic Rewards on typical routes',
      high: 'Business Classic Rewards & upgrades on long-haul',
    },
    scenarios: [
      { label: 'Skywards Everyday & merchandise', detail: 'Everyday retail redemptions price around AED 0.02 per mile', cpp: 0.5 },
      { label: 'DXB → LHR · Economy Classic', detail: '42,500 miles + ~AED 400 fees vs ~AED 2,300 cash fare', cpp: 1.2 },
      { label: 'DXB → LHR · Business Classic', detail: '97,750 miles (post-May-2026 +15%) + ~AED 1,150 fees vs ~AED 8,000 cash fare', cpp: 1.91 },
    ],
    sources: [
      { label: 'NerdWallet Skywards valuation', url: 'https://www.nerdwallet.com/travel/learn/how-much-are-emirates-skywards-miles-worth' },
      { label: 'AwardFares Skywards guide', url: 'https://awardfares.com/programs/emirates-skywards' },
      { label: 'AwardWallet — May 2026 devaluation', url: 'https://awardwallet.com/news/airlines/emirates-skywards-2026-devaluation/' },
    ],
  },
  {
    id: 'etihad-guest',
    name: 'Etihad Guest',
    owner: 'Etihad Airways',
    type: 'airline',
    country: 'AE',
    unit: 'mile',
    homeCurrency: 'AED',
    usd: { low: 0.006, median: 0.01, high: 0.016 },
    confidence: 'high',
    blurb:
      'Saver Awards (renamed from GuestSeats in Nov 2025, shown as “Promo seats” when booking) anchor the value. Best on long-haul Business and well-priced partner awards; Gold tier and above get up to 10% off Promo-seat awards since April 2026. Non-flight redemptions dilute value.',
    bands: {
      low: 'Hotels, car hire and other non-flight redemptions',
      median: 'Economy Saver Awards',
      high: 'Business & First Saver Awards, sweet-spot partner awards',
    },
    scenarios: [
      { label: 'Non-flight redemptions', detail: 'Hotels and car hire typically return under 1¢ per mile', cpp: 0.6 },
      { label: 'AUH → LHR · Economy Saver', detail: '44,000 miles + ~AED 350 fees vs ~AED 2,100 cash fare', cpp: 1.1 },
      { label: 'AUH → CDG · Business Saver', detail: '88,000 miles + ~AED 600 fees vs ~AED 5,600 cash fare', cpp: 1.55 },
    ],
    sources: [
      { label: 'The Point Calculator — Etihad', url: 'https://www.thepointcalculator.com/us/etihad-guest-miles/etihad-guest-miles-value/' },
      { label: 'The Points Guy — Etihad Guest', url: 'https://thepointsguy.com/loyalty-programs/best-strategies-for-etihad-guest-miles/' },
      { label: 'AwardFares Etihad Guest', url: 'https://awardfares.com/programs/etihad-guest-miles' },
      { label: 'AwardFares — the new Etihad Guest', url: 'https://awardfares.com/blog/introducing-etihad-guest/' },
    ],
  },
  {
    id: 'qatar-privilege-club',
    name: 'Privilege Club (Avios)',
    owner: 'Qatar Airways',
    type: 'airline',
    country: 'QA',
    unit: 'Avios',
    homeCurrency: 'QAR',
    usd: { low: 0.007, median: 0.014, high: 0.045 },
    confidence: 'high',
    blurb:
      'Qatar Airways uses Avios, so value tracks the wider Avios ecosystem. Off-peak QSuite awards are among the highest-value redemptions anywhere in points. Partner short-haul award floors moved in the July 2026 partner devaluations; own-metal pricing is intact.',
    bands: {
      low: 'Peak-date economy, upgrades, low-value dynamic pricing',
      median: 'Economy awards, typical Avios benchmark',
      high: 'Off-peak QSuite Business awards (3–5¢ per Avios)',
    },
    scenarios: [
      { label: 'Upgrades & peak economy', detail: 'Dynamic pricing on peak dates erodes value', cpp: 0.7 },
      { label: 'DOH → DXB · Economy award', detail: '8,000 Avios + ~QAR 200 fees vs ~QAR 600 cash fare', cpp: 1.4 },
      { label: 'DOH → LHR · QSuite off-peak', detail: '42,500 Avios + ~QAR 550 fees vs ~QAR 7,500 cash fare', cpp: 4.5 },
    ],
    sources: [
      { label: 'AwardFares Privilege Club guide', url: 'https://awardfares.com/blog/qatar-airways-privilege-club-guide/' },
      { label: 'point.me Privilege Club guide', url: 'https://www.point.me/insights/the-complete-guide-to-qatar-airways-privilege-club/' },
      { label: 'Upgraded Points — QSuites with points', url: 'https://upgradedpoints.com/travel/airlines/best-ways-to-book-qatar-qsuites-with-points-and-miles/' },
    ],
  },
  {
    id: 'saudia-alfursan',
    name: 'AlFursan',
    owner: 'Saudia',
    type: 'airline',
    country: 'SA',
    unit: 'mile',
    homeCurrency: 'SAR',
    usd: { low: 0.005, median: 0.01, high: 0.016 },
    confidence: 'medium',
    blurb:
      'Zone-based award charts, heavily discounted since the 2022 refresh. Domestic awards from 4,500 miles; best value on long-haul Business rewards.',
    bands: {
      low: 'Rewards+ pricing, extras and short-notice awards',
      median: 'Standard economy rewards, domestic & regional',
      high: 'Long-haul Business & First rewards',
    },
    scenarios: [
      { label: 'Extras & Rewards+ awards', detail: 'Double-price Rewards+ inventory and ancillaries', cpp: 0.5 },
      { label: 'JED → RUH · Domestic Economy', detail: '9,000 miles + ~SAR 90 fees vs ~SAR 450 cash fare', cpp: 1.1 },
      { label: 'JED → LHR · Business reward', detail: '75,000 miles + ~SAR 700 fees vs ~SAR 5,200 cash fare', cpp: 1.6 },
    ],
    sources: [
      { label: '10xTravel AlFursan award charts', url: 'https://10xtravel.com/saudia-alfursan-miles-award-charts/' },
      { label: 'AwardFares AlFursan', url: 'https://awardfares.com/programs/saudia-alfursan' },
      { label: 'Saudia miles redemption', url: 'https://www.saudia.com/loyalty-program/about-alfursan-program/alfursan-miles/miles-redemption' },
    ],
  },
  {
    id: 'flynas-nasmiles',
    name: 'nasmiles',
    owner: 'flynas',
    type: 'airline',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.005, median: 0.009, high: 0.013 },
    confidence: 'provisional',
    blurb:
      'Revenue-linked low-cost programme: points offset the base fare (taxes paid in cash), with no blackout dates. flynas publishes no fixed redemption rate, so this range is modelled.',
    bands: {
      low: 'Extras: seats, bags, meals',
      median: 'Typical fare redemptions',
      high: 'High-fare dates & Business redemptions',
    },
    scenarios: [
      { label: 'Fare redemptions (modelled)', detail: 'Earn ≈1 pt/SAR; redemption value modelled at SAR 0.02–0.05 per point', cpp: 0.9 },
    ],
    sources: [
      { label: 'flynas — redeem nasmiles', url: 'https://www.flynas.com/en/redeem-smiles' },
      { label: 'PointCheckout nasmiles guide', url: 'https://www.pointcheckout.com/en/blog/vm7sch/all-you-need-to-know-about-the-nasmiles-rewards-program' },
    ],
  },

  {
    id: 'riyadh-air-sfeer',
    name: 'Sfeer',
    owner: 'Riyadh Air',
    type: 'airline',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.006, median: 0.01, high: 0.014 },
    confidence: 'provisional',
    blurb:
      'Launched October 2025 alongside Riyadh Air’s first London flights; full rollout during 2026. Dynamic earn and redemption tied to cash fares (points never expire, shareable with family), now extended by RX Pay (July 2026) — a Mastercard with Saudi banks earning Sfeer points on everyday spend, with retail redemption per Riyadh Air’s press release. Still no published redemption values — range modelled on comparable revenue-based programmes; RX Pay’s retail rate is the likely future anchor.',
    bands: {
      low: 'Weak dynamic pricing dates (modelled)',
      median: 'Typical fare-linked redemptions (modelled)',
      high: 'Promotional & premium-cabin pricing (modelled)',
    },
    scenarios: [
      { label: 'Dynamic redemptions (modelled)', detail: 'Fare-linked pricing, similar to JetBlue/Southwest models', cpp: 1.0 },
    ],
    sources: [
      { label: 'Riyadh Air — Sfeer', url: 'https://www.riyadhair.com/en/sfeer' },
      { label: 'One Mile at a Time — Sfeer launch', url: 'https://onemileatatime.com/news/riyadh-air-loyalty-program/' },
      { label: 'Riyadh Air — RX Pay press release', url: 'https://www.zawya.com/en/press-release/companies-news/riyadh-air-launches-rx-pay-its-new-branded-card-that-rewards-guests-everywhere-they-go-407735' },
      { label: 'AwardWallet — Sfeer programme', url: 'https://awardwallet.com/airlines/riyadh-air-sfeer/' },
    ],
  },
  {
    id: 'gulfair-falconflyer',
    name: 'Falconflyer',
    owner: 'Gulf Air',
    type: 'airline',
    country: 'BH',
    unit: 'mile',
    homeCurrency: 'BHD',
    usd: { low: 0.0055, median: 0.01, high: 0.016 },
    confidence: 'medium',
    blurb:
      'Bahrain’s flag carrier. Awards from 6,000 miles and well-priced Falcon Gold upgrades. A published floor now anchors the low end: converting to Accor ALL (4,000 miles = 1,000 points = €20) guarantees ~0.58¢ per mile; Gulf Air sells top-up miles at USD 25 per 1,000 (a 2.5¢ ceiling).',
    bands: {
      low: 'Accor ALL conversion floor (~0.58¢ guaranteed)',
      median: 'Economy awards on typical routes (modelled)',
      high: 'Falcon Gold awards & upgrades',
    },
    scenarios: [
      { label: 'Accor ALL conversion floor', detail: '4,000 miles = 1,000 ALL points = €20 → ~0.58¢ per mile guaranteed', cpp: 0.58 },
      { label: 'Economy awards (modelled)', detail: 'Typical medium/long-haul redemptions', cpp: 1.0 },
      { label: 'Falcon Gold upgrades', detail: 'Business-cabin awards & upgrades, aimed well', cpp: 1.6 },
    ],
    sources: [
      { label: 'Gulf Air — redeem miles', url: 'https://www.gulfair.com/falconflyer/redeem' },
      { label: 'Accor ALL — Gulf Air partner', url: 'https://all.accor.com/a/en/loyalty-program/partners/airlines/gulfair.html' },
      { label: 'Accor ALL — points value', url: 'https://all.accor.com/loyalty-program/use/booking-with-points/index.en.shtml' },
    ],
  },
  {
    id: 'kuwait-oasis-club',
    name: 'Oasis Club',
    owner: 'Kuwait Airways',
    type: 'airline',
    country: 'KW',
    unit: 'mile',
    homeCurrency: 'KWD',
    usd: { low: 0.005, median: 0.009, high: 0.016 },
    confidence: 'medium',
    blurb:
      'Zone-based award chart (e.g. Kuwait ⇄ Dubai return: 15,000 miles economy, 30,000 business). Miles expire after 3 years. Value modelled from the published chart against typical cash fares.',
    bands: {
      low: 'Short-haul awards vs cheap cash fares, extras',
      median: 'Economy awards within the GCC zone',
      high: 'Business & First awards and upgrades',
    },
    scenarios: [
      { label: 'KWI ⇄ DXB · Economy return', detail: '15,000 miles + ~KWD 15 fees vs ~KWD 60 cash fare', cpp: 1.0 },
      { label: 'KWI ⇄ DXB · Business return', detail: '30,000 miles + ~KWD 20 fees vs ~KWD 170 cash fare', cpp: 1.6 },
      { label: 'Extras & weak dates', detail: 'Upgrades and awards against discounted fares', cpp: 0.5 },
    ],
    sources: [
      { label: 'Oasis Club — redemption table', url: 'https://oasisclub.kuwaitairways.com/en/SpendMiles/Pages/MilesRedemptionTable.aspx' },
      { label: 'Oasis redemption table (PDF)', url: 'https://www.kuwaitairways.com/Documents/Redemption_Table_En_V0920.pdf' },
      { label: 'Oasis Club — FAQs', url: 'https://oasisclub.kuwaitairways.com/en/Contact/Pages/FAQs.aspx' },
    ],
  },
  {
    id: 'turkish-miles-smiles',
    name: 'Miles&Smiles',
    owner: 'Turkish Airlines',
    type: 'airline',
    country: 'TR',
    unit: 'mile',
    homeCurrency: 'USD',
    usd: { low: 0.007, median: 0.011, high: 0.02 },
    confidence: 'high',
    blurb:
      'Widely held across the Gulf. Devalued in 2024 and again quietly in Dec 2025 (same-country partner awards +50%, new Hawaii zone), but typical redemptions still land around 1.1¢ and fixed-chart long-haul Business sweet spots reach ~2¢. Values shown in USD as the lira floats.',
    bands: {
      low: 'Post-devaluation dynamic economy pricing',
      median: 'Typical economy awards booked ~90 days out',
      high: 'Long-haul Business sweet spots & close-in bargains',
    },
    scenarios: [
      { label: 'Dynamic economy · weak dates', detail: 'Post-2024-devaluation pricing on many routes', cpp: 0.7 },
      { label: 'Economy awards · typical', detail: 'Average redemption booked ~90 days ahead', cpp: 1.1 },
      { label: 'Business long-haul sweet spots', detail: '65K US–Istanbul / 85–90K US–Europe partner Business on the fixed chart vs $2,500+ cash fares', cpp: 2.0 },
    ],
    sources: [
      { label: 'NerdWallet — Turkish miles value', url: 'https://www.nerdwallet.com/travel/learn/turkish-airlines-miles-value' },
      { label: 'AwardWallet — Turkish award chart', url: 'https://awardwallet.com/airlines/turkish-airlines-award-chart/' },
      { label: 'TPG monthly valuations', url: 'https://thepointsguy.com/loyalty-programs/monthly-valuations/' },
      { label: 'AwardFares — Miles&Smiles', url: 'https://awardfares.com/programs/turkish-airlines-miles-and-smiles' },
    ],
  },

  // ─────────────── Banks — UAE ───────────────
  {
    id: 'amex-mr-uae',
    name: 'Membership Rewards (UAE)',
    owner: 'American Express ME',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0025, median: 0.0055, high: 0.01 },
    confidence: 'medium',
    blurb:
      'UAE Amex transfers to Skywards at 2:1, so each MR point is worth roughly half a Skywards mile. The US (5:4, Sep 2025) and UK (2:1, Feb 2026) have since converged toward the UAE’s long-standing ratio. Vouchers and statement credit sit below the transfer value.',
    bands: {
      low: 'Statement credit & retail vouchers',
      median: 'Skywards transfer redeemed at typical mile value',
      high: 'Skywards transfer into premium-cabin awards',
    },
    scenarios: [
      { label: 'Vouchers / statement credit', detail: 'Weakest use of MR points', cpp: 0.25 },
      { label: 'Skywards transfer · economy value', detail: '20,000 MR → 10,000 miles at ~1.1¢ per mile', cpp: 0.55 },
      { label: 'Skywards transfer · premium value', detail: '2:1 transfer into a ~2.0¢ Business Classic award', cpp: 1.0 },
    ],
    sources: [
      { label: 'Emirates — Amex partner page', url: 'https://www.emirates.com/us/english/skywards/partners/amex/' },
      { label: 'TPG — MR transfer partners', url: 'https://thepointsguy.com/credit-cards/membership-rewards-partner-guide/' },
      { label: 'Head for Points — MR→Skywards changes', url: 'https://headforpoints.com/2025/12/18/american-express-membership-rewards-transfers-to-emirates-devalued/' },
    ],
  },
  {
    id: 'enbd-plus-points',
    name: 'Plus Points',
    owner: 'Emirates NBD',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.204, median: 0.218, high: 0.272 },
    confidence: 'high',
    blurb:
      'Unusually large per-point value because points accrue slowly. Bank-published rates: AED 0.75 as cashback, AED 1.00 towards education fees, Nol top-ups and donations.',
    bands: {
      low: 'Statement cashback (1 pt = AED 0.75)',
      median: 'Blended typical redemption',
      high: 'Education, Nol & donations (1 pt = AED 1.00)',
    },
    scenarios: [
      { label: 'Statement cashback', detail: '1 Plus Point = AED 0.75, min 500 points', cpp: 20.4 },
      { label: 'Education / Nol / donations', detail: '1 Plus Point = AED 1.00', cpp: 27.2 },
    ],
    sources: [
      { label: 'Emirates NBD — redeeming Plus Points', url: 'https://www.emiratesnbd.com/en/help-and-support/redeeming-plus-points' },
    ],
  },
  {
    id: 'adcb-touchpoints',
    name: 'TouchPoints',
    owner: 'ADCB',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0009, median: 0.00136, high: 0.0018 },
    confidence: 'medium',
    blurb:
      'ADCB guidance puts 200,000 TouchPoints at roughly AED 1,000. Max partners and e-commerce partners redeem at better rates; the 2023 rate change trimmed standard merchants.',
    bands: {
      low: 'Weaker voucher & merchant options',
      median: 'Standard redemption (~AED 0.005 per point)',
      high: 'TouchPoints Max & e-commerce partners',
    },
    scenarios: [
      { label: 'Weaker vouchers', detail: 'Post-2023 standard merchant rates', cpp: 0.09 },
      { label: 'Standard redemption', detail: '≈200,000 TouchPoints = AED 1,000', cpp: 0.136 },
      { label: 'Max partners', detail: 'Higher published rate at select partners', cpp: 0.18 },
    ],
    sources: [
      { label: 'ADCB — redeeming TouchPoints', url: 'https://www.adcb.com/en/get-in-touch/faqs/redeem-touchpoints/redeeming-the-touchPoints' },
      { label: 'ADCB — rate changes', url: 'https://www.adcb.com/en/personal/general/tp-redemption-rates' },
    ],
  },
  {
    id: 'fab-rewards',
    name: 'FAB Rewards',
    owner: 'First Abu Dhabi Bank',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0007, median: 0.0011, high: 0.0013 },
    confidence: 'high',
    blurb:
      'Devalued: the old AED 0.007 cashback rate is no longer published anywhere. Current anchors are all FAB-published — in-store POS at 25,000 points = AED 100 (AED 0.004/pt, value varies by product, 2-year validity) and transfers at 16:1 to Skywards, 12:1 to Etihad Guest, 14:1 to Shukran.',
    bands: {
      low: 'Skywards transfer at typical mile value',
      median: 'In-store POS redemption (AED 0.004 per point)',
      high: 'Etihad Guest transfer sweet spots',
    },
    scenarios: [
      { label: 'Skywards transfer · typical', detail: '16 FAB = 1 mile at ~1.1¢', cpp: 0.07 },
      { label: 'Calculator cashback', detail: '66,800 points = AED 200 (~AED 0.003/pt)', cpp: 0.08 },
      { label: 'In-store POS', detail: '25,000 points = AED 100', cpp: 0.11 },
      { label: 'Etihad transfer · sweet spot', detail: '12 FAB = 1 mile at ~1.6¢', cpp: 0.13 },
    ],
    sources: [
      { label: 'FAB Rewards FAQ (PDF)', url: 'https://www.bankfab.com/-/media/fabgroup/home/personal/rewards-faqs/fab-rewards-faqs/fab-rewards-faqs.pdf?view=1' },
      { label: 'FAB Rewards programme', url: 'https://www.bankfab.com/en-ae/personal/rewards/fab-rewards/program' },
      { label: 'FAB Rewards calculator', url: 'https://www.bankfab.com/en-ae/personal/rewards/fab-rewards/calculate' },
    ],
  },
  {
    id: 'mashreq-vantage',
    name: 'Vantage (ex-Salaam)',
    owner: 'Mashreq',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.00034, median: 0.00082, high: 0.00265 },
    confidence: 'high',
    blurb:
      'The story flipped in 2026: new transfer partners — Qatar Airways Privilege Club at 17:1 and Etihad Guest at 22:1 — mean premium Avios redemptions now return ~3.7× the app cashback. Published fixed rates: cashback 380 pts = AED 1, noon 288 = AED 1, Amazon.ae/POS 303 = AED 1; Skywards stays 32:1.',
    bands: {
      low: 'Skywards transfer (32:1) at typical mile value',
      median: 'Published fixed rates (cashback / noon blend)',
      high: 'Avios transfer (17:1) into off-peak QSuite awards',
    },
    scenarios: [
      { label: 'Skywards 32:1 · typical', detail: '32 pts = 1 mile at ~1.1¢', cpp: 0.034 },
      { label: 'App cashback', detail: '380 points = AED 1', cpp: 0.072 },
      { label: 'noon redemption', detail: '288 points = AED 1', cpp: 0.095 },
      { label: 'Avios 17:1 · QSuite off-peak', detail: '17 pts = 1 Avios at ~4.5¢ off-peak QSuite value', cpp: 0.265 },
    ],
    sources: [
      { label: 'Mashreq Vantage redemption structure (PDF)', url: 'https://www.mashreq.com/-/jssmedia/pdfs/neo/vantage/vantage-points-earning-redemption-structure_en.ashx' },
      { label: 'Mashreq Vantage', url: 'https://www.mashreq.com/en/uae/neo/mashreq-vantage/' },
    ],
  },

  {
    id: 'enbd-upoints',
    name: 'Upoints (U by Emaar)',
    owner: 'Emirates NBD × Emaar',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0245, median: 0.0272, high: 0.0272 },
    confidence: 'high',
    blurb:
      'Emirates NBD’s second points system, on the U by Emaar cards. Flat published rate — 10 Upoints = AED 1 — but only spendable inside the Emaar ecosystem (malls, hotels, entertainment, 2,500+ stores).',
    bands: {
      low: 'Discounted ~10% if you wouldn’t otherwise spend at Emaar',
      median: 'In-store redemption at 10 points = AED 1',
      high: 'Same flat rate — typical is the best case',
    },
    scenarios: [
      { label: 'Emaar in-store redemption', detail: '10 Upoints = AED 1 at 2,500+ stores', cpp: 2.72 },
      { label: 'Outside-Emaar haircut', detail: 'Value discounted if Emaar spend isn’t natural for you', cpp: 2.45 },
    ],
    sources: [
      { label: 'Emirates NBD — redeeming Upoints', url: 'https://www.emiratesnbd.com/en/help-and-support/redeeming-upoints' },
      { label: 'U by Emaar FAQ', url: 'https://www.ubyemaar.com/en-ae/faq/' },
    ],
  },
  {
    id: 'adib-exceed',
    name: 'Exceed Rewards',
    owner: 'ADIB',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.49, median: 0.545, high: 0.545 },
    confidence: 'high',
    blurb:
      'ADIB’s unified rewards platform: 1 Exceed point = AED 2 (legacy card points migrated at 200:1). Note ADIB’s Etihad co-brand covered cards earn Etihad Guest miles directly instead — value those with the Etihad Guest entry.',
    bands: {
      low: 'Conservative haircut on restricted redemptions',
      median: 'Published rate: 1 point = AED 2',
      high: 'Same flat rate — typical is the best case',
    },
    scenarios: [
      { label: 'Exceed redemption', detail: '1 Exceed point = AED 2 (bank-published)', cpp: 54.5 },
      { label: 'Conservative haircut', detail: 'Restricted catalogue options', cpp: 49.0 },
    ],
    sources: [
      { label: 'ADIB card notices (Exceed migration)', url: 'https://www.adib.ae/en/personal/cards/notices' },
      { label: 'Etihad — ADIB co-brand cards', url: 'https://www.etihad.com/en/etihadguest/our-partners/financial/abu-dhabi-islamic-bank' },
    ],
  },
  {
    id: 'dib-walaa',
    name: 'Wala’a Rewards',
    owner: 'Dubai Islamic Bank',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0007, median: 0.00136, high: 0.00225 },
    confidence: 'medium',
    blurb:
      'Cash/bill redemptions anchor the value (~AED 0.005 per point); transfers to Avios or Etihad Guest at 20:1 only beat that if you aim the miles at premium-cabin awards.',
    bands: {
      low: 'Avios/Etihad transfers redeemed at ordinary mile values',
      median: 'Bill payments & travel (20,000 = AED 100)',
      high: 'Avios transfer into off-peak QSuite awards',
    },
    scenarios: [
      { label: 'Bills & travel', detail: '20,000 Wala’a = AED 100 (cashback is AED 80 — SHAMS cards only)', cpp: 0.136 },
      { label: 'Avios/Etihad transfer · typical', detail: '20,000 Wala’a = 1,000 miles at ~1.4¢', cpp: 0.07 },
      { label: 'Avios transfer · QSuite sweet spot', detail: '20:1 into a ~4.5¢ off-peak QSuite award', cpp: 0.225 },
    ],
    sources: [
      { label: 'DIB — Wala’a Rewards', url: 'https://www.dib.ae/personal/other-services/walaa-rewards' },
      { label: 'Paisabazaar — DIB rewards cards', url: 'https://www.paisabazaar.ae/credit-cards/articles/dib-points-rewards-credit-cards-in-uae/' },
    ],
  },
  {
    id: 'sc-360-rewards',
    name: '360° Rewards',
    owner: 'Standard Chartered UAE',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0017, median: 0.00218, high: 0.003 },
    confidence: 'high',
    blurb:
      'Anchored at 125 points = AED 1 for cashback / pay-with-rewards. Converts into 40+ airline and hotel programmes (including Skywards), which is where the high end lives.',
    bands: {
      low: 'Catalogue merchandise & weaker vouchers',
      median: 'Cashback / purchase with rewards (125 pts = AED 1)',
      high: 'Airline & hotel transfers aimed at premium awards',
    },
    scenarios: [
      { label: 'Purchase with rewards', detail: '125 points = AED 1', cpp: 0.218 },
      { label: 'Voucher catalogue', detail: 'Below-par merchandise pricing', cpp: 0.17 },
      { label: 'Airline/hotel transfers', detail: '40+ partners incl. Skywards; premium awards', cpp: 0.3 },
    ],
    sources: [
      { label: 'Standard Chartered — 360° Rewards', url: 'https://www.sc.com/ae/360rewards/' },
      { label: 'SC — purchase with rewards', url: 'https://www.sc.com/ae/credit-cards/purchase-with-rewards/' },
    ],
  },
  {
    id: 'citi-thankyou-uae',
    name: 'ThankYou Points (UAE)',
    owner: 'Citibank UAE',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.006, median: 0.009, high: 0.016 },
    confidence: 'medium',
    blurb:
      'Strong per-point value: cash at 45:1, travel rebates at 30:1 (15,000 pts = AED 500, re-verified live), and Skywards transfers at 1,000 → 800 miles (devalued from 1:1).',
    bands: {
      low: 'Cash for points (45 points = AED 1)',
      median: 'Travel rebate (15,000 points = AED 500)',
      high: 'Skywards transfer into premium-cabin awards',
    },
    scenarios: [
      { label: 'Cash for points', detail: '45 points = AED 1', cpp: 0.605 },
      { label: 'Travel rebate', detail: '15,000 points = AED 500 against travel spend', cpp: 0.907 },
      { label: 'Skywards transfer · premium', detail: '1,000 → 800 miles into a ~2.0¢ award', cpp: 1.6 },
    ],
    sources: [
      { label: 'Citibank UAE — rewards & redemptions', url: 'https://www.citibank.ae/credit-cards/rewards-and-redemptions/rewards-rebate' },
      { label: 'AwardWallet — Citi→Skywards rate change', url: 'https://awardwallet.com/blog/citi-emirates-transfer-rate/' },
    ],
  },
  {
    id: 'cbd-rewards',
    name: 'CBD Rewards',
    owner: 'Commercial Bank of Dubai',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.00028, median: 0.00055, high: 0.001 },
    confidence: 'medium',
    blurb:
      'Published transfer ratio: 20 CBD points = 1 Skywards or Etihad Guest mile (min 10,000 points). CBD doesn’t publish a cashback rate, so the mile value drives the whole range.',
    bands: {
      low: 'Transfers redeemed at weak mile values',
      median: 'Skywards/Etihad transfer at typical mile value (~1.1¢)',
      high: 'Transfer into premium-cabin Classic awards',
    },
    scenarios: [
      { label: 'Miles transfer · economy value', detail: '20 points = 1 mile at ~0.55¢', cpp: 0.028 },
      { label: 'Miles transfer · typical', detail: '20 points = 1 mile at ~1.1¢', cpp: 0.055 },
      { label: 'Miles transfer · premium', detail: '20:1 into a ~2.0¢ Business Classic award', cpp: 0.1 },
    ],
    sources: [
      { label: 'CBD Rewards FAQ (PDF)', url: 'https://www.cbd.ae/docs/default-source/default-document-library/faqs-cbd-reward-points-wallet-3.pdf' },
      { label: 'PointCheckout — CBD programme', url: 'https://www.pointcheckout.com/en/blog/wh5az6/all-you-need-to-know-about-the-commercial-bank-of-dubai' },
    ],
  },
  {
    id: 'rak-rewards',
    name: 'RAKrewards',
    owner: 'RAKBANK',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0016, median: 0.0022, high: 0.003 },
    confidence: 'provisional',
    blurb:
      'RAKBANK publishes no fixed rate — points redeem dynamically through its travel/shopping portal (min 10,000 points, valid 36 months). Range modelled from portal pricing; treat as indicative.',
    bands: {
      low: 'Merchandise & weaker portal pricing',
      median: 'Travel portal redemptions (modelled)',
      high: 'Well-priced flight/hotel redemptions',
    },
    scenarios: [
      { label: 'Travel portal (modelled)', detail: '300+ airlines, 300k hotels; no fixed published rate', cpp: 0.22 },
    ],
    sources: [
      { label: 'RAKrewards portal', url: 'https://rewards.rakbank.ae/rak/customer.html?action=rewards' },
      { label: 'MyMoneySouq — RAK Rewards', url: 'https://www.mymoneysouq.com/financial-blog/all-you-need-to-know-about-rak-rewards' },
    ],
  },
  {
    id: 'ei-smartmiles',
    name: 'EI SmartMiles',
    owner: 'Emirates Islamic',
    type: 'bank',
    country: 'AE',
    unit: 'point',
    homeCurrency: 'AED',
    usd: { low: 0.0011, median: 0.0025, high: 0.004 },
    confidence: 'medium',
    blurb:
      'Emirates Islamic now publishes conversion ratios: 10,000 SmartMiles = 1,000 Skywards miles (10:1) or 2,500 Etihad Guest miles (4:1), in multiples of 10,000, transferred within 5 working days. The Etihad route is the clear winner. Its Skywards co-brand cards earn Skywards miles directly.',
    bands: {
      low: 'Skywards transfer (10:1) at typical mile value',
      median: 'Etihad Guest transfer (4:1) at typical mile value',
      high: 'Etihad transfer into Business sweet spots',
    },
    scenarios: [
      { label: 'Skywards 10:1 · typical', detail: '10,000 SmartMiles = 1,000 miles at ~1.1¢', cpp: 0.11 },
      { label: 'Etihad 4:1 · typical', detail: '10,000 SmartMiles = 2,500 miles at ~1.0¢', cpp: 0.25 },
      { label: 'Etihad 4:1 · Business sweet spot', detail: '2,500 miles per 10,000 at ~1.6¢', cpp: 0.4 },
    ],
    sources: [
      { label: 'EI — SmartMiles conversion', url: 'https://www.emiratesislamic.ae/en/personal-banking/cards/credit-cards/ei-smartmiles-conversion' },
      { label: 'Emirates Islamic — card rewards', url: 'https://www.emiratesislamic.ae/en/help-and-support/understanding-your-credit-card-rewards' },
    ],
  },

  // ─────────────── Banks — KSA ───────────────
  {
    id: 'alrajhi-mokafaa',
    name: 'Mokafaa',
    owner: 'Al Rajhi Bank',
    type: 'bank',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.0004, median: 0.00056, high: 0.00133 },
    confidence: 'medium',
    blurb:
      'Best used as a feeder into Saudia AlFursan (18–24 points per mile, with recurring 30–50% transfer bonuses). A Turkish Miles&Smiles route at 20:1 also exists and can compete during bonuses. Merchant redemptions vary by partner.',
    bands: {
      low: 'AlFursan transfer at 24:1, economy value',
      median: 'AlFursan transfer at 18:1, typical value',
      high: '18:1 with 50% transfer bonus into Business awards',
    },
    scenarios: [
      { label: 'AlFursan 24:1 · economy', detail: '24 Mokafaa points = 1 mile at ~1¢', cpp: 0.04 },
      { label: 'AlFursan 18:1 · typical', detail: '18 Mokafaa points = 1 mile at ~1¢', cpp: 0.056 },
      { label: 'AlFursan 18:1 + 50% bonus · Business', detail: 'Effective 12 pts/mile into a ~1.6¢ Business reward', cpp: 0.133 },
    ],
    sources: [
      { label: 'Al Rajhi — AlFursan transfer', url: 'https://www.alrajhibank.com.sa/en/Personal/Offers/CardsOffers/Mokafaa/AlFursan' },
      { label: 'Saudia — Mokafaa partner page', url: 'https://www.saudia.com/pages/loyalty-program/alfursan-partners/financial-partners/mokafaa' },
    ],
  },
  {
    id: 'sab-icsab',
    name: 'ICSAB+ Rewards',
    owner: 'SAB (Saudi Awwal Bank)',
    type: 'bank',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.0187, median: 0.0227, high: 0.0267 },
    confidence: 'high',
    blurb:
      'Clean bank-published rates: 1,000 points = SAR 70 as cashback or SAR 100 as e-vouchers. E-vouchers are the clear winner if you can use them.',
    bands: {
      low: 'Cashback (1,000 pts = SAR 70)',
      median: 'Blended typical redemption',
      high: 'E-vouchers (1,000 pts = SAR 100)',
    },
    scenarios: [
      { label: 'Cashback', detail: '1,000 points = SAR 70', cpp: 1.87 },
      { label: 'E-voucher', detail: '1,000 points = SAR 100', cpp: 2.67 },
    ],
    sources: [
      { label: 'SAB ICSAB+ Rewards', url: 'https://www.sab.com/en/personal/icsab-plus/' },
    ],
  },

  {
    id: 'snb-lak',
    name: 'LAK Rewards',
    owner: 'SNB (Saudi National Bank)',
    type: 'bank',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.00213, median: 0.00267, high: 0.00267 },
    confidence: 'high',
    blurb:
      'Clean published anchors: 1 LAK = SAR 0.008 as cash or SAR 0.01 as e-vouchers — and the e-voucher is the ceiling: even the best transfer (AlFursan at 7:1 into a 1.6¢ Business award) returns less. Points expire 12 months after crediting, so redeem on a schedule.',
    bands: {
      low: 'Cash redemption (1 LAK = SAR 0.008)',
      median: 'E-vouchers (1 LAK = SAR 0.01)',
      high: 'E-vouchers — flat top; transfers never beat it',
    },
    scenarios: [
      { label: 'Cash redemption', detail: '1 LAK point = SAR 0.008', cpp: 0.213 },
      { label: 'E-voucher', detail: '1 LAK point = SAR 0.01', cpp: 0.267 },
      { label: 'AlFursan transfer · runner-up', detail: '7,000 LAK = 1,000 miles at ~1.6¢ — below the e-voucher ceiling', cpp: 0.229 },
    ],
    sources: [
      { label: 'SNB — LAK Rewards', url: 'https://www.alahli.com/en/pages/personal-banking/credit-cards/lak-rewards' },
      { label: 'LAK T&C (PDF)', url: 'https://www.alahli.com/-/media/project/snb/snb-web/documents/2025/tc/lak-tc-eng.pdf' },
      { label: 'PointCheckout — LAK programme', url: 'https://www.pointcheckout.com/en/blog/okl581/all-you-need-to-know-about-the-lak-rewards-program' },
    ],
  },
  {
    id: 'riyad-hassad',
    name: 'Hassad Rewards',
    owner: 'Riyad Bank',
    type: 'bank',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.024, median: 0.0267, high: 0.0267 },
    confidence: 'high',
    blurb:
      'Simple flat programme: every 1,000 Hassad points = SAR 100 voucher (redeemable from 1,000 points). Little upside beyond the flat rate, but no traps either.',
    bands: {
      low: 'Haircut if voucher partners don’t match your spending',
      median: 'Voucher redemption (1,000 pts = SAR 100)',
      high: 'Same flat rate — typical is the best case',
    },
    scenarios: [
      { label: 'Voucher redemption', detail: '1,000 points = SAR 100', cpp: 2.67 },
      { label: 'Partner-restricted haircut', detail: 'If Hassad Mall partners don’t fit your spending', cpp: 2.4 },
    ],
    sources: [
      { label: 'Riyad Bank — Hassad Rewards', url: 'https://www.riyadbank.com/personal-banking/hassad-rewards-program' },
      { label: 'PointCheckout — Hassad programme', url: 'https://www.pointcheckout.com/en/blog/21981e/all-you-need-to-know-about-the-hassad-rewards-program' },
    ],
  },
  {
    id: 'amex-mr-ksa',
    name: 'Membership Rewards (KSA)',
    owner: 'American Express Saudi Arabia',
    type: 'bank',
    country: 'SA',
    unit: 'point',
    homeCurrency: 'SAR',
    usd: { low: 0.004, median: 0.005, high: 0.008 },
    confidence: 'high',
    blurb:
      'Separate entity from Amex UAE with its own rates: vouchers/cash around SAR 0.015 per point, and AlFursan transfers at 2 MR = 1 mile. Points never expire.',
    bands: {
      low: 'Vouchers & cash (~SAR 0.015 per point)',
      median: 'AlFursan transfer at typical mile value',
      high: 'AlFursan transfer into long-haul Business awards',
    },
    scenarios: [
      { label: 'Vouchers & cash', detail: '1 MR ≈ SAR 0.015 (bank-published estimate)', cpp: 0.4 },
      { label: 'AlFursan transfer · typical', detail: '2 MR = 1 mile at ~1¢', cpp: 0.5 },
      { label: 'AlFursan transfer · Business', detail: '2:1 into a ~1.6¢ long-haul Business award', cpp: 0.8 },
    ],
    sources: [
      { label: 'Amex Saudi Arabia — Membership Rewards', url: 'https://www.americanexpress.com.sa/content/membership-rewards-programme' },
      { label: 'Saudia — Amex partner page', url: 'https://www.saudia.com/pages/loyalty-program/alfursan-partners/financial-partners/american-express-credit-card' },
    ],
  },

  // ─────────────── Banks — Qatar ───────────────
  {
    id: 'qnb-life-rewards',
    name: 'Life Rewards',
    owner: 'QNB',
    type: 'bank',
    country: 'QA',
    unit: 'point',
    homeCurrency: 'QAR',
    usd: { low: 0.011, median: 0.0137, high: 0.0185 },
    confidence: 'high',
    blurb:
      'Bank-published anchor: 20 points = QAR 1 across 1,500+ outlets, bills and top-ups. Conversions to Avios (Privilege Club) can beat that when aimed at QSuite awards.',
    bands: {
      low: 'Weaker partner redemptions',
      median: 'Merchant & bill payments (20 pts = QAR 1)',
      high: 'Avios conversion aimed at premium awards',
    },
    scenarios: [
      { label: 'Weaker partners', detail: 'Below-par outlet redemptions', cpp: 1.1 },
      { label: 'Merchants & bills', detail: '20 points = QAR 1 at 1,500+ outlets', cpp: 1.37 },
      { label: 'Avios conversion', detail: 'Into Privilege Club QSuite sweet spots', cpp: 1.85 },
    ],
    sources: [
      { label: 'QNB — redeem Life Rewards', url: 'https://qnb.com/sites/qnb/qnbqatar/page/en/enredeemliferewards.html' },
      { label: 'QNB Life Rewards FAQ', url: 'https://www.qnb.com/sites/qnb/qnbqatar/page/en/enfaqsliferewards.html' },
    ],
  },
  {
    id: 'cbq-rewards',
    name: 'CBQ Rewards',
    owner: 'Commercial Bank of Qatar',
    type: 'bank',
    country: 'QA',
    unit: 'point',
    homeCurrency: 'QAR',
    usd: { low: 0.022, median: 0.0275, high: 0.033 },
    confidence: 'high',
    blurb:
      'Anchored by CBQ’s published Sadara Visa Infinite figure — 10,000 CB Reward Points worth QAR 1,000 (stated in its joining-bonus context) — consistent with vouchers at ~10 fils per point and 1,000 points = QAR 100 on Qgrabs. FlyMiles flight redemptions can stretch a little further.',
    bands: {
      low: 'Weaker voucher partners',
      median: 'Vouchers & Qgrabs (≈QAR 0.10 per point)',
      high: 'FlyMiles flight redemptions',
    },
    scenarios: [
      { label: 'Gift vouchers', detail: '≈10 fils (QAR 0.10) per point', cpp: 2.75 },
      { label: 'Weaker partners', detail: 'Below-par voucher pricing', cpp: 2.2 },
      { label: 'FlyMiles flights', detail: '5,000 FlyMiles ≈ a Dubai ticket / QAR 500', cpp: 3.3 },
    ],
    sources: [
      { label: 'CBQ — Sadara Visa Infinite (published point value)', url: 'https://www.cbq.com.qa/en/personal/cards/consumer-credit-cards/sadara-visa-infinite-credit-card' },
      { label: 'CBQ — credit card rewards FAQ', url: 'https://www.cbq.com.qa/en/personal/cards/cards-sub-pages/credit-card-rewards---faqs' },
    ],
  },
  {
    id: 'alrayan-rewards',
    name: 'Al Rayan Rewards',
    owner: 'Masraf Al Rayan',
    type: 'bank',
    country: 'QA',
    unit: 'point',
    homeCurrency: 'QAR',
    usd: { low: 0.0124, median: 0.0137, high: 0.0165 },
    confidence: 'high',
    blurb:
      'Published cashback anchor: 1 Al Rayan point = QAR 0.05. Earn rates vary by card tier (1 point per QAR 5–10 spent). Also a Qatar Airways Privilege Club partner.',
    bands: {
      low: 'Weaker catalogue redemptions',
      median: 'Cashback (1 point = QAR 0.05)',
      high: 'Vouchers & Avios conversion sweet spots',
    },
    scenarios: [
      { label: 'Cashback', detail: '1 point = QAR 0.05', cpp: 1.37 },
      { label: 'Weaker redemptions', detail: 'Below-par catalogue options', cpp: 1.24 },
      { label: 'Vouchers & Avios', detail: 'Privilege Club partner conversions, aimed well', cpp: 1.65 },
    ],
    sources: [
      { label: 'Al Rayan Rewards T&C', url: 'https://marblobstorage.blob.core.windows.net/files/marfiles/PremiereForms/EN/Al-Rayan-Rewards-Terms-and-Conditions_Premier.pdf' },
      { label: 'Qatar Airways — Al Rayan partner', url: 'https://www.qatarairways.com/en/Privilege-Club/our-partners/masraf-al-rayan.mobile.html' },
    ],
  },
  {
    id: 'doha-miles',
    name: 'Doha Miles',
    owner: 'Doha Bank',
    type: 'bank',
    country: 'QA',
    unit: 'point',
    homeCurrency: 'QAR',
    usd: { low: 0.0055, median: 0.0096, high: 0.036 },
    confidence: 'high',
    blurb:
      'Doha Bank publishes exact rates: cashback at QR 0.02 per mile, POS at partner stores (incl. Lulu) at QR 0.035, and an Avios exchange at 1 Doha Mile = 0.8 Avios (revised from 1:1 in Oct 2022 — our earlier near-parity model was wrong). Earn ~1 mile per QAR 7–8. Its Qatar Airways co-brand card earns Avios directly instead.',
    bands: {
      low: 'Cashback (QR 0.02 per mile)',
      median: 'POS at partner stores (QR 0.035 per mile)',
      high: '0.8:1 Avios exchange into off-peak QSuite awards',
    },
    scenarios: [
      { label: 'Cashback', detail: '10,000 Doha Miles = QR 200 (QR 0.02/mile)', cpp: 0.55 },
      { label: 'POS at partner stores', detail: '10,000 Doha Miles = QR 350 (QR 0.035/mile)', cpp: 0.96 },
      { label: 'Avios conversion · typical', detail: '1 Doha Mile = 0.8 Avios at ~1.4¢', cpp: 1.12 },
      { label: 'Avios · off-peak QSuite', detail: '0.8 Avios per mile at ~4.5¢', cpp: 3.6 },
    ],
    sources: [
      { label: 'Doha Bank — Doha Miles', url: 'https://www.dohabank.com.qa/personal/cards/credit-card-offers/doha-miles/' },
      { label: 'Doha Bank — Avios exchange programme', url: 'https://www.dohabank.com.qa/personal/cards/credit-card-offers/doha-miles/doha-miles-exchange-program/' },
      { label: 'Qatar Airways — Doha Bank cards', url: 'https://www.qatarairways.com/en/Privilege-Club/our-partners/doha-bank-credit-cards.html' },
    ],
  },
]

export const SCENARIO_COUNT = PROGRAMS.reduce((n, p) => n + p.scenarios.length, 0)
export const SOURCE_COUNT = PROGRAMS.reduce((n, p) => n + p.sources.length, 0)
