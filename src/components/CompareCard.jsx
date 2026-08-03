import { useState } from 'react'
import { COUNTRIES } from '../data/programs.js'
import { fxPerUsd, formatMoney } from '../data/currencies.js'

// Airlines compare cleanly (miles are similar units); bank points are shown
// as value-per-10k in the programme's home currency since earn rates differ.
export default function CompareCard({ programs, currency, selectedId, onSelect }) {
  const [tab, setTab] = useState('airline')
  const [market, setMarket] = useState('all')

  const list = programs
    .filter((p) => p.type === tab && (market === 'all' || p.country === market))
    .slice()
    .sort((a, b) => b.usd.median - a.usd.median)

  const markets = ['all', ...new Set(programs.filter((p) => p.type === tab).map((p) => p.country))]
  const maxMedian = Math.max(...list.map((p) => p.usd.median), 0.000001)
  // Bank point values span ~40x (Plus Points vs Mokafaa); sqrt scale keeps
  // the smaller programmes' bars readable. Airlines stay linear.
  const barWidth = (median) => {
    const t = median / maxMedian
    return (tab === 'bank' ? Math.sqrt(t) : t) * 100
  }

  return (
    <section className="card compare">
      <div className="card-head">
        <h2>Compare programmes</h2>
        <div className="tab-group">
          <button
            className={`tab ${tab === 'airline' ? 'tab-active' : ''}`}
            onClick={() => { setTab('airline'); setMarket('all') }}
          >
            Airlines
          </button>
          <button
            className={`tab ${tab === 'bank' ? 'tab-active' : ''}`}
            onClick={() => { setTab('bank'); setMarket('all') }}
          >
            Banks
          </button>
        </div>
      </div>
      <p className="compare-sub">
        {tab === 'airline'
          ? 'Typical value per mile, converted to ' + currency + '. Bars show the median; programmes differ in how far the high end stretches.'
          : 'Bank points use different earn rates, so compare the value of 10,000 points in each programme’s home market.'}
      </p>

      <div className="compare-filter">
        {markets.map((m) => (
          <button
            key={m}
            className={`pill pill-xs ${market === m ? 'pill-active' : ''}`}
            onClick={() => setMarket(m)}
          >
            {m === 'all' ? 'All' : `${COUNTRIES[m].flag} ${COUNTRIES[m].name}`}
          </button>
        ))}
      </div>

      <div className="compare-list">
        {list.map((p) => {
          const width = barWidth(p.usd.median)
          const perPoint = p.usd.median * fxPerUsd[currency]
          const per10k = p.usd.median * 10000 * fxPerUsd[p.homeCurrency]
          return (
            <button
              key={p.id}
              className={`compare-row ${p.id === selectedId ? 'compare-row-active' : ''}`}
              onClick={() => onSelect(p.id)}
              title="Open in calculator"
            >
              <div className="compare-meta">
                <span className="compare-name">
                  {COUNTRIES[p.country].flag} {p.name}
                  {p.confidence === 'provisional' && <span className="mini-flag">est.</span>}
                </span>
                <span className="compare-owner">{p.owner}</span>
              </div>
              <div className="compare-bar-track">
                <div className="compare-bar" style={{ width: `${Math.max(width, 4)}%` }} />
              </div>
              <div className="compare-value">
                {tab === 'airline'
                  ? formatMoney(perPoint, currency) + ' / mile'
                  : formatMoney(per10k, p.homeCurrency) + ' / 10k'}
              </div>
            </button>
          )
        })}
      </div>

      <div className="compare-note">
        {tab === 'airline' ? (
          <>Qatar&rsquo;s Avios high end (off-peak QSuites) reaches <strong>3&times;</strong> its typical value — the widest spread in the region.</>
        ) : (
          <>ADIB Exceed and Emirates NBD Plus Points look huge per point because they accrue slowly — always compare <em>earn rate &times; point value</em>, not point value alone.</>
        )}
      </div>
    </section>
  )
}
