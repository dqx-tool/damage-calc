export function callFormula(fn, params, fallback = 0) {

  if (!fn) return fallback

  return fn(...params)
}

export function createFormulaParams({
  mp,
  kougeki,
  shubi_E,
  kouma,
  kaima,
  kiyousa,
  osharesa
}) {

  return [
    mp,
    kougeki,
    shubi_E,
    kouma,
    kaima,
    kiyousa,
    osharesa
  ]
}