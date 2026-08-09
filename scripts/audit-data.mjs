// Data-integrity audit for the valuation dataset.
// Run with: npm run audit   (exits non-zero on any failure)
//
// This is the contract every agent and human must satisfy before committing
// changes to src/data/programs.js or src/data/currencies.js.

import { PROGRAMS, COUNTRIES } from '../src/data/programs.js'
import { CURRENCIES } from '../src/data/currencies.js'

const failures = []
const warnings = []
const fail = (msg) => failures.push(msg)
const warn = (msg) => warnings.push(msg)

const currencyCodes = new Set(CURRENCIES.map((c) => c.code))
const confidences = new Set(['high', 'medium', 'provisional'])
const seenIds = new Set()
const EPSILON = 0.011 // cpp rounding tolerance (¢)

for (const p of PROGRAMS) {
  const tag = p.id ?? p.name ?? '<unnamed>'

  // ── identity ──
  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) fail(`${tag}: id must be kebab-case`)
  if (seenIds.has(p.id)) fail(`${tag}: duplicate id`)
  seenIds.add(p.id)
  for (const field of ['name', 'owner', 'unit', 'blurb']) {
    if (!p[field]) fail(`${tag}: missing ${field}`)
  }
  if (!['airline', 'bank'].includes(p.type)) fail(`${tag}: type must be airline|bank`)
  if (!COUNTRIES[p.country]) fail(`${tag}: country ${p.country} not in COUNTRIES`)
  if (!currencyCodes.has(p.homeCurrency)) fail(`${tag}: homeCurrency ${p.homeCurrency} not in CURRENCIES`)

  // ── valuation range ──
  const { low, median, high } = p.usd ?? {}
  if (![low, median, high].every((v) => typeof v === 'number' && v > 0)) {
    fail(`${tag}: usd.low/median/high must all be positive numbers`)
    continue
  }
  if (!(low <= median && median <= high)) fail(`${tag}: usd range not ordered (${low} / ${median} / ${high})`)
  if (high > low * 25) warn(`${tag}: high is ${(high / low).toFixed(0)}x low — check this spread is real`)

  // ── confidence & provisional honesty ──
  if (!confidences.has(p.confidence)) fail(`${tag}: confidence must be high|medium|provisional`)
  if (p.confidence === 'provisional' && !/modell?ed|estimate|no .*published/i.test(p.blurb)) {
    warn(`${tag}: provisional but blurb doesn't say the range is modelled`)
  }

  // ── bands ──
  for (const band of ['low', 'median', 'high']) {
    if (!p.bands?.[band]) fail(`${tag}: missing bands.${band}`)
  }

  // ── scenarios must sit inside the published range ──
  if (!p.scenarios?.length) fail(`${tag}: needs at least one scenario`)
  for (const s of p.scenarios ?? []) {
    if (!s.label || !s.detail || typeof s.cpp !== 'number') fail(`${tag}: malformed scenario ${s.label ?? '?'}`)
    if (s.cpp < low * 100 - EPSILON || s.cpp > high * 100 + EPSILON) {
      fail(`${tag}: scenario "${s.label}" cpp ${s.cpp}¢ outside range [${(low * 100).toFixed(2)}, ${(high * 100).toFixed(2)}]¢`)
    }
  }

  // ── sources ──
  if (!p.sources?.length) fail(`${tag}: needs at least one source`)
  for (const src of p.sources ?? []) {
    if (!src.label || !/^https:\/\//.test(src.url ?? '')) fail(`${tag}: source needs label + https url`)
  }
}

// ── currency pegs ──
const PEGS = { AED: 3.6725, SAR: 3.75, QAR: 3.64, BHD: 0.376, USD: 1 }
for (const [code, rate] of Object.entries(PEGS)) {
  const c = CURRENCIES.find((x) => x.code === code)
  if (!c) fail(`currency ${code} missing`)
  else if (c.perUsd !== rate) fail(`${code} peg drifted: ${c.perUsd} ≠ official ${rate}`)
}
if (!CURRENCIES.find((c) => c.code === 'KWD')) fail('KWD missing (indicative basket-peg rate)')

// ── report ──
const airlines = PROGRAMS.filter((p) => p.type === 'airline').length
const scenarios = PROGRAMS.reduce((n, p) => n + p.scenarios.length, 0)
console.log(`audited ${PROGRAMS.length} programmes (${airlines} airlines, ${PROGRAMS.length - airlines} banks), ${scenarios} scenarios, ${new Set(PROGRAMS.map((p) => p.country)).size} markets`)
for (const w of warnings) console.log(`  warn: ${w}`)
if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}
console.log('all invariants hold ✓')
