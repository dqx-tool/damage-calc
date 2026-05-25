export function applyTension({
  base,
  tension_P,
  firstHit
}) {

  if (!firstHit) return base

  const t = [0, 10, 20, 30, 40, 40][2 * tension_P - 2]

  return base.map(v => v * tension_P + t)
}