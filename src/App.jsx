import { useMemo, useState } from 'react'
import { PROGRAMS, AS_OF, SCENARIO_COUNT, SOURCE_COUNT } from './data/programs.js'
import Calculator from './components/Calculator.jsx'
import CompareCard from './components/CompareCard.jsx'
import ProgramGrid from './components/ProgramGrid.jsx'

export default function App() {
  const [programId, setProgramId] = useState('emirates-skywards')
  const [currency, setCurrency] = useState('AED')
  const [points, setPoints] = useState(50000)

  const program = useMemo(() => PROGRAMS.find((p) => p.id === programId), [programId])

  const selectProgram = (id) => {
    setProgramId(id)
    const p = PROGRAMS.find((x) => x.id === id)
    if (p) setCurrency(p.homeCurrency)
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">PointsWorth</span>
        </div>
        <div className="topbar-right">
          <span className="chip">🇦🇪 🇸🇦 🇶🇦 🇧🇭 🇰🇼 🇹🇷</span>
          <span className="chip chip-muted">Data · {AS_OF}</span>
        </div>
      </header>

      <section className="hero">
        <img className="hero-art" src="/art/hero.jpg" alt="" aria-hidden="true" />
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          POINTS VALUATOR
        </div>
        <h1>
          Know what your miles
          <br className="hero-br" />
          <span className="hero-dim">are really worth</span>
        </h1>
        <p className="hero-sub">
          Instant valuation of airline miles and bank reward points across the Gulf and Türkiye —
          grounded in published redemption rates and modelled award scenarios, not guesswork.
        </p>
      </section>

      <section className="stats-row">
        <div className="stat-tile">
          <div className="stat-value">{PROGRAMS.length}</div>
          <div className="stat-label">Programmes tracked</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{new Set(PROGRAMS.map((p) => p.country)).size}</div>
          <div className="stat-label">Markets covered</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{SCENARIO_COUNT}</div>
          <div className="stat-label">Redemption scenarios modelled</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{SOURCE_COUNT}</div>
          <div className="stat-label">Public sources</div>
        </div>
      </section>

      <main className="main-grid">
        <Calculator
          program={program}
          programs={PROGRAMS}
          currency={currency}
          points={points}
          onProgram={setProgramId}
          onCurrency={setCurrency}
          onPoints={setPoints}
        />
        <CompareCard programs={PROGRAMS} currency={currency} selectedId={programId} onSelect={selectProgram} />
      </main>

      <ProgramGrid programs={PROGRAMS} currency={currency} selectedId={programId} onSelect={selectProgram} />

      <footer className="footer">
        <div className="card methodology">
          <img className="method-art" src="/art/method.jpg" alt="" aria-hidden="true" />
          <h3>How these valuations work</h3>
          <p>
            No airline or bank publishes “what a point is worth”, so every figure here is an
            estimate built from two inputs: <strong>published redemption rates</strong> (bank
            cashback tables, transfer ratios into airline programmes) and{' '}
            <strong>modelled award scenarios</strong> — pricing a real route in points + fees
            against the cash fare for the same seat. The <em>low</em> and <em>high</em> ends of
            each range are real redemptions someone could make, not statistical noise.
          </p>
          <p>
            AED, SAR, QAR and BHD are hard-pegged to the US dollar, so currency conversion uses
            the official pegs (3.6725 / 3.75 / 3.64 / 0.376); KWD floats against a currency
            basket, so an indicative rate is used. Valuations reviewed {AS_OF}. Ranges shift when
            programmes devalue — Emirates has announced Classic Reward price rises from May 2026,
            for example.
          </p>
          <p>
            <strong>Co-brand cards:</strong> many Gulf cards earn airline miles directly instead
            of bank points — Emirates NBD and Emirates Islamic Skywards cards, ADCB and ADIB
            Etihad cards, QNB / CBQ / Doha Bank Qatar Airways cards. For those, value the miles
            with the airline’s entry above. <strong>Not yet listed:</strong> QIB Absher, Dukhan
            DAwards, Bank Albilad Mukafaat and Alinma Mazaya publish no redemption rates at all;
            they’ll be added when a reliable anchor exists.
          </p>
          <p className="disclaimer">
            PointsWorth is an independent guide. Estimates only — not financial advice, and not
            affiliated with any airline or bank. Always check the programme’s own calculator
            before redeeming.
          </p>
        </div>
      </footer>
    </div>
  )
}
