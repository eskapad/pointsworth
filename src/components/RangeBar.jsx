// Gradient range bar with a marker at the median position, echoing the
// "HEAT" slider in the reference UI.
export default function RangeBar({ low, median, high, compact = false }) {
  const span = high - low
  const pos = span > 0 ? ((median - low) / span) * 100 : 50
  return (
    <div className={compact ? 'rangebar rangebar-compact' : 'rangebar'}>
      <div className="rangebar-track">
        <div className="rangebar-marker" style={{ left: `${pos}%` }} />
      </div>
    </div>
  )
}
