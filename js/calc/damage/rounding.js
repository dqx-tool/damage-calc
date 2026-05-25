export function safeFloor(v) {

  if (Math.abs(v - Math.round(v)) < 1e-7) {
    return Math.round(v)
  }

  return Math.floor(v - 1e-7)
}