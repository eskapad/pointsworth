// AED, SAR, QAR and BHD are hard-pegged to the USD, so fixed rates are exact
// enough for valuation purposes (pegs unchanged since 1997–2003). KWD is
// pegged to an undisclosed currency basket — the rate below is indicative.
export const CURRENCIES = [
  { code: 'AED', label: 'UAE Dirham', perUsd: 3.6725 },
  { code: 'SAR', label: 'Saudi Riyal', perUsd: 3.75 },
  { code: 'QAR', label: 'Qatari Riyal', perUsd: 3.64 },
  { code: 'BHD', label: 'Bahraini Dinar', perUsd: 0.376 },
  { code: 'KWD', label: 'Kuwaiti Dinar', perUsd: 0.3066 },
  { code: 'USD', label: 'US Dollar', perUsd: 1 },
]

export const fxPerUsd = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.perUsd]))

export function formatMoney(amount, code) {
  const abs = Math.abs(amount)
  let digits
  if (abs >= 100) digits = 0
  else if (abs >= 1) digits = 2
  else if (abs >= 0.01) digits = 3
  else digits = 4
  const n = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
  return `${code} ${n}`
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n)
}
