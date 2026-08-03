# PointsWorth

Instant valuation of airline miles and bank reward points across the Gulf and
Türkiye (UAE · KSA · Qatar · Bahrain · Kuwait · Türkiye). Pick a programme,
enter a points balance, get an estimated value range in AED, SAR, QAR, BHD,
KWD or USD — with the redemption scenarios that produced the range shown
underneath.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/
```

No backend, no database — the whole site is static and deploys anywhere
(Vercel / Netlify / Cloudflare Pages).

## Where the numbers live

Everything editorial is in **`src/data/programs.js`**. Each programme has:

- `usd: { low, median, high }` — value of one point in USD. This is the
  number the whole site runs on.
- `bands` — one-line explanation of what kind of redemption each end of the
  range represents.
- `scenarios` — the modelled redemptions (route, points + fees vs cash fare,
  resulting cents-per-point) that justify the range. Shown in the UI.
- `confidence` — `high` (bank-published rates / well-documented awards),
  `medium` (derived from transfer ratios), `provisional` (modelled, flagged
  "est." in the UI).
- `sources` — public links backing the numbers.

Currency conversion uses the fixed USD pegs (AED 3.6725, SAR 3.75, QAR 3.64,
BHD 0.376) in `src/data/currencies.js`. KWD is pegged to a currency basket,
so an indicative rate (0.3066/USD) is used; Turkish Miles&Smiles is valued in
USD because the lira floats. A real FX API only becomes necessary if floating
display currencies (EGP, TRY…) are added.

## Updating valuations

1. Re-price each programme's scenarios (award cost + fees vs cash fare on the
   same flight) roughly monthly, or when a programme announces changes —
   e.g. Emirates' Classic Reward price rises from 20 May 2026.
2. Adjust `usd.low/median/high` and the scenario `cpp` values.
3. Bump `AS_OF` in `programs.js`.

## Valuation methodology (short version)

No airline or bank publishes "what a point is worth". The ranges here come
from two anchors:

- **Published redemption rates** — bank cashback tables (e.g. FAB 1 pt =
  AED 0.007, QNB 20 pts = QAR 1, SAB 1,000 pts = SAR 70–100) and transfer
  ratios (Mashreq 32 pts → 1 Skywards mile, Mokafaa 18–24 pts → 1 AlFursan
  mile, Amex UAE 2 MR → 1 Skywards mile).
- **Modelled award scenarios** — pricing a real route in points + fees
  against the cash fare for the same seat, e.g. DOH→LHR QSuite off-peak at
  42,500 Avios ≈ 4.5¢/Avios.

Low/high are real redemptions someone could make, not statistical bounds.

## Coverage notes

Several banks run **multiple parallel systems** — these are tracked as separate
programmes: Emirates NBD (Plus Points + Upoints), Emirates Islamic (SmartMiles;
its Cashback and Amazon points are separate schemes), FAB (FAB Rewards; the
Al Futtaim and Islamic variants redeem at similar rates).

**Co-brand cards** (Emirates NBD/EI Skywards cards, ADCB/ADIB Etihad cards,
QNB/CBQ/Doha Bank Qatar Airways cards) earn airline miles directly — value
those with the airline's entry, not a bank entry.

**Deliberately not listed** (no published redemption rate anywhere, no reliable
anchor to model from): QIB Absher, Dukhan Bank DAwards, Bank Albilad Mukafaat,
Alinma Mazaya. RAKrewards, EI SmartMiles and Doha Miles are included but
flagged `provisional` because their ranges are modelled, not published.

## Docker

```bash
docker compose up -d --build   # build + serve at http://localhost:8080
```

Or without compose:

```bash
docker build -t pointsworth .
docker run -d -p 8080:80 --name pointsworth pointsworth
```

Multi-stage build: `node:20-alpine` compiles the Vite bundle, `nginx:1.27-alpine`
serves the static output (~50 MB final image). Updating valuations =
edit `src/data/programs.js`, rebuild the image.
