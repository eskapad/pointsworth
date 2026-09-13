import { useMemo } from 'react'
import { COUNTRIES } from '../data/programs.js'
import { CURRENCIES, fxPerUsd, formatMoney, formatNumber } from '../data/currencies.js'
import { useTween } from '../hooks.js'
import RangeBar from './RangeBar.jsx'

const CONFIDENCE = {
  high: { label: 'High confidence', cls: 'conf-high' },
  medium: { label: 'Medium confidence', cls: 'conf-medium' },
  provisional: { label: 'Provisional estimate', cls: 'conf-provisional' },
}

function bandForCpp(program, cpp) {
  const lowC = program.usd.low * 100
  const highC = program.usd.high * 100
  const t = highC > lowC ? (cpp - lowC) / (highC - lowC) : 0.5
  if (t < 0.34) return 'band-low'
  if (t < 0.72) return 'band-mid'
  return 'band-high'
}

export default function Calculator({ program, programs, currency, points, onProgram, onCurrency, onPoints }) {
  const fx = fxPerUsd[currency]
  const n = Number(points) || 0

  const target = useMemo(
    () => ({
      low: n * program.usd.low * fx,
      median: n * program.usd.median * fx,
      high: n * program.usd.high * fx,
    }),
    [n, program, fx],
  )
  // Displayed values tween toward their targets so the result visibly
  // recalculates — except on currency changes, which snap (a unit switch
  // mid-tween would pair the new label with the old currency's number).
  const value = {
    low: useTween(target.low, { snapKey: currency }),
    median: useTween(target.median, { snapKey: currency }),
    high: useTween(target.high, { snapKey: currency }),
  }

  const perPointHome = program.usd.median * fxPerUsd[program.homeCurrency]
  const conf = CONFIDENCE[program.confidence]

  const airlines = programs.filter((p) => p.type === 'airline')
  const bankGroups = [
    { label: 'Banks — UAE', list: programs.filter((p) => p.type === 'bank' && p.country === 'AE') },
    { label: 'Banks — Saudi Arabia', list: programs.filter((p) => p.type === 'bank' && p.country === 'SA') },
    { label: 'Banks — Qatar', list: programs.filter((p) => p.type === 'bank' && p.country === 'QA') },
  ]

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    onPoints(raw === '' ? '' : Math.min(Number(raw), 100_000_000))
  }

  return (
    <section className="card calculator" id="calculator">
      <div className="card-head">
        <h2>Value calculator</h2>
        <span className={`conf-badge ${conf.cls}`}>{conf.label}</span>
      </div>

      <div className="calc-controls">
        <label className="field">
          <span className="field-label">Programme</span>
          <div className="select-wrap">
            <select value={program.id} onChange={(e) => onProgram(e.target.value)}>
              <optgroup label="Airlines">
                {airlines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {COUNTRIES[p.country].flag} {p.name} — {p.owner}
                  </option>
                ))}
              </optgroup>
              {bankGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.list.map((p) => (
                    <option key={p.id} value={p.id}>
                      {COUNTRIES[p.country].flag} {p.name} — {p.owner}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </label>

        <label className="field">
          <span className="field-label">{program.unit === 'mile' ? 'Miles' : 'Points'}</span>
          <input
            className="points-input"
            inputMode="numeric"
            value={points === '' ? '' : formatNumber(points)}
            onChange={handleInput}
            placeholder="50,000"
          />
        </label>

        <div className="field">
          <span className="field-label">Show value in</span>
          <div className="pill-group">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                className={`pill ${c.code === currency ? 'pill-active' : ''}`}
                onClick={() => onCurrency(c.code)}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="result-panel">
        <div className="result-label">
          Estimated value of {formatNumber(n)} {program.name} {program.unit === 'mile' ? 'miles' : 'points'}
        </div>
        <div className="result-value">{formatMoney(value.median, currency)}</div>
        <div className="result-range">
          {formatMoney(value.low, currency)} <span className="range-sep">to</span>{' '}
          {formatMoney(value.high, currency)}
        </div>
        <RangeBar low={value.low} median={value.median} high={value.high} />
        <div className="result-ends">
          <span>low</span>
          <span>typical</span>
          <span>high</span>
        </div>
      </div>

      <div className="bands">
        <div className="band">
          <div className="band-title">
            <span className="band-dot dot-low" /> Low · {formatMoney(value.low, currency)}
          </div>
          <p>{program.bands.low}</p>
        </div>
        <div className="band">
          <div className="band-title">
            <span className="band-dot dot-mid" /> Typical · {formatMoney(value.median, currency)}
          </div>
          <p>{program.bands.median}</p>
        </div>
        <div className="band">
          <div className="band-title">
            <span className="band-dot dot-high" /> High · {formatMoney(value.high, currency)}
          </div>
          <p>{program.bands.high}</p>
        </div>
      </div>

      <div className="scenarios">
        <h3>Where this range comes from</h3>
        <p className="scenarios-sub">{program.blurb}</p>
        {program.scenarios.map((s) => (
          <div className="scenario-row" key={s.label}>
            <div className="scenario-main">
              <div className="scenario-label">{s.label}</div>
              <div className="scenario-detail">{s.detail}</div>
            </div>
            <span className={`cpp-chip ${bandForCpp(program, s.cpp)}`}>
              {s.cpp.toFixed(s.cpp < 0.2 ? 3 : s.cpp < 2 ? 2 : 1)}¢ / {program.unit === 'Avios' ? 'Avios' : program.unit}
            </span>
          </div>
        ))}
        <div className="sources-line">
          Per-{program.unit === 'Avios' ? 'Avios' : program.unit} value:{' '}
          <strong>{formatMoney(perPointHome, program.homeCurrency)}</strong> typical · Sources:{' '}
          {program.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
