import { useEffect, useRef, useState } from 'react'
import { COUNTRIES } from '../data/programs.js'
import { fxPerUsd, formatMoney } from '../data/currencies.js'
import RangeBar from './RangeBar.jsx'

const CONF_DOT = { high: 'conf-dot-high', medium: 'conf-dot-medium', provisional: 'conf-dot-provisional' }

const MARKETS = [
  { id: 'all', label: 'All markets' },
  ...Object.entries(COUNTRIES).map(([id, c]) => ({ id, label: `${c.flag} ${c.name}` })),
]
const TYPES = [
  { id: 'all', label: 'All types' },
  { id: 'airline', label: 'Airlines' },
  { id: 'bank', label: 'Banks' },
]

export default function ProgramGrid({ programs, selectedId, onSelect }) {
  const [market, setMarket] = useState('all')
  const [type, setType] = useState('all')
  const gridRef = useRef(null)

  const list = programs.filter(
    (p) => (market === 'all' || p.country === market) && (type === 'all' || p.type === type),
  )

  // Entrance choreography: cards rise in with a stagger as they reach the
  // viewport. Cards that already animated keep their .in class across filters.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = [...grid.querySelectorAll('.program-card:not(.in)')]
    if (!cards.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('in')
          // Clear the stagger delay once in, so hover transforms stay snappy.
          setTimeout(() => (e.target.style.transitionDelay = ''), 800)
          io.unobserve(e.target)
        })
      },
      { threshold: 0.12 },
    )
    cards.forEach((c, i) => {
      c.style.transitionDelay = `${(i % 8) * 55}ms`
      io.observe(c)
    })
    return () => io.disconnect()
  }, [market, type])

  return (
    <section className="grid-section">
      <div className="grid-head">
        <h2>All programmes</h2>
        <span className="grid-sub">Values shown per point in each programme’s home currency — tap a card to load it in the calculator</span>
      </div>
      <div className="filter-row">
        <div className="pill-group">
          {MARKETS.map((m) => (
            <button key={m.id} className={`pill pill-sm ${market === m.id ? 'pill-active' : ''}`} onClick={() => setMarket(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="pill-group">
          {TYPES.map((t) => (
            <button key={t.id} className={`pill pill-sm ${type === t.id ? 'pill-active' : ''}`} onClick={() => setType(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <span className="filter-count">{list.length} programme{list.length === 1 ? '' : 's'}</span>
      </div>
      <div className="program-grid" ref={gridRef}>
        {list.map((p) => {
          const fx = fxPerUsd[p.homeCurrency]
          const unit = p.unit === 'Avios' ? 'Avios' : p.unit
          return (
            <button
              key={p.id}
              className={`card program-card ${p.id === selectedId ? 'program-card-active' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <img
                className="pc-art"
                src={`/art/accent-${p.country.toLowerCase()}.jpg`}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div className="pc-top">
                <span className="pc-flag">{COUNTRIES[p.country].flag}</span>
                <span className={`pc-type ${p.type === 'airline' ? 'type-airline' : 'type-bank'}`}>
                  {p.type === 'airline' ? 'Airline' : 'Bank'}
                </span>
                {p.confidence === 'provisional' && <span className="mini-flag">est.</span>}
                <span className={`conf-dot ${CONF_DOT[p.confidence]}`} title={`${p.confidence} confidence`} />
              </div>
              <div className="pc-name">{p.name}</div>
              <div className="pc-owner">{p.owner}</div>
              <div className="pc-value">
                {formatMoney(p.usd.median * fx, p.homeCurrency)}
                <span className="pc-unit"> / {unit}</span>
              </div>
              <RangeBar low={p.usd.low} median={p.usd.median} high={p.usd.high} compact />
              <div className="pc-range">
                {formatMoney(p.usd.low * fx, p.homeCurrency)} – {formatMoney(p.usd.high * fx, p.homeCurrency)}
              </div>
              <div className="pc-per10k">
                10,000 {unit === 'mile' ? 'miles' : 'points'} ≈{' '}
                {formatMoney(p.usd.median * 10000 * fx, p.homeCurrency)}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
