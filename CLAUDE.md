# PointsWorth

Valuation site for airline miles and bank reward points across the Gulf and
Türkiye (31 programmes, 6 markets). Vite + React, no UI libraries, hand-rolled
dark dashboard CSS. The **dataset is the product**; the site is a thin,
beautiful shell around `src/data/programs.js`.

## Commands

```bash
npm run dev      # dev server :5173 (preview launch config: "pointsworth")
npm run build    # production bundle → dist/
npm run audit    # data-integrity audit — MUST pass before any commit
docker compose up -d --build   # production container :8080
```

## Iron laws

1. **Never invent a rate.** Every low/median/high traces to a published rate,
   a published transfer ratio, or an explicitly modelled scenario. No anchor →
   the programme is excluded and named in the methodology footer.
2. **`npm run audit` green before every commit** that touches `src/data/`.
   It enforces range ordering, scenario-cpp-inside-range, sources, and pegs.
3. **Values are USD per point**; display converts via pegs in
   `src/data/currencies.js` (AED 3.6725 · SAR 3.75 · QAR 3.64 · BHD 0.376 ·
   KWD ~0.3066 indicative · Miles&Smiles valued in USD since TRY floats).
4. **Provisional means provisional**: modelled ranges get
   `confidence: 'provisional'`, a blurb admitting it, and the orange `est.`
   badge renders automatically. Confidence `high` requires an
   official published anchor among the scenarios.
5. **Components derive, never hardcode** — counts, market lists and programme
   facts come from the data modules (the stat tiles compute themselves).
6. Verify UI work in the running preview before calling it done; a change
   nobody watched work is not done.

## The agent team

Custom agents live in `.claude/agents/`. Route work to them — in parallel
where tasks are independent:

| Agent | Use for | Writes? |
|---|---|---|
| `valuation-researcher` | new programmes, rate refreshes, fact-checks | no — returns entries |
| `data-auditor` | after any data edit; pre-commit gate; staleness sweeps | no — reports findings |
| `gulf-ui-engineer` | UI features/fixes inside the design system | yes |
| `design-reviewer` | post-UI-change critique, desktop + mobile screenshots | no — punch list |

**Recipes** (main session orchestrates, applies edits, commits):

- *Add a programme*: `valuation-researcher` (entry + sources) → apply to
  `programs.js` → `data-auditor` → commit. Two+ programmes → researchers in
  parallel, one per market.
- *Refresh cycle*: run the saved workflow **`refresh-valuations`**
  (`.claude/workflows/`) — inventories the dataset, fans out researchers per
  market, adversarially audits every proposed change, returns an edit plan.
  Scope it with `args: {focus: ["id", ...]}`. Afterwards: apply edits, bump
  `AS_OF`, run audit, update README + memory.
  **This runs automatically**: a local scheduled task
  (`pointsworth-monthly-refresh`, 1st of each month) executes the full cycle
  and pushes. Don't run a second full refresh in the same month unless a
  devaluation hits the news; keep the task's prompt in sync with this file.
- *UI feature*: `gulf-ui-engineer` implements → `design-reviewer` critiques →
  fix `BREAKS`/`OFF-SYSTEM` findings before commit.
- *Release*: audit + build green → commit (imperative subject, why in body) →
  push to `github.com/eskapad/pointsworth` (SSH auth as eskapad works; repo
  *creation* would need `gh`/token — see README).

## Domain knowledge that keeps being needed

- Airline entries are comparable (¢/mile); bank points are not — earn rates
  differ wildly, so bank comparisons show value-per-10k and the compare card
  uses a sqrt scale. ADIB Exceed (AED 2/pt) and ENBD Plus (AED 0.75–1/pt) look
  huge *because points accrue slowly* — never present per-point value as the
  whole story.
- Transfer ratios in the dataset (keep derived values consistent — the
  auditor checks): Mashreq→Skywards 32:1, →Etihad 22:1, →Avios 17:1 ·
  CBD→Skywards/Etihad 20:1 · DIB→Avios/Etihad 20:1 · Citi UAE→Skywards
  1000:800 · Amex UAE 2:1 · Amex KSA→AlFursan 2:1 · Mokafaa→AlFursan 18–24:1
  (recurring 30–50% bonuses) · FAB→Skywards 16:1, →Etihad 12:1 ·
  EI SmartMiles→Skywards 10:1, →Etihad 4:1 · SNB LAK→AlFursan 7:1 ·
  Doha Miles→Avios 1:0.8.
- Co-brand cards (ENBD/EI Skywards, ADCB/ADIB Etihad, QNB/CBQ/Doha Bank Qatar
  Airways) earn airline miles directly → they are the airline's entry, never a
  new bank entry.
- Excluded for lack of any anchor: QIB Absher, Dukhan DAwards, Bank Albilad
  Mukafaat, Alinma Mazaya. Riyadh Air **Sfeer** is provisional until it
  publishes redemption values (full rollout during 2026) — recheck each cycle.

## Roadmap (agreed direction, pick up freely)

1. Arabic i18n + RTL (KSA audience) — design system must survive RTL.
2. Per-programme SEO pages (static routes from the dataset; search traffic
   like "how much are Skywards miles worth" is the growth engine).
3. Earn-rate layer: card-level earn rates × point value = return-on-spend, the
   comparison bank points actually deserve.
4. GitHub Actions: audit + build on push (the audit script is CI-ready).
5. FX API only when a floating display currency (EGP, TRY) is added.
