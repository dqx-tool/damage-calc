// skill.formula から計算式を生成
export function compileFormula(formula) {

  if (!formula) return null

  return Function(
    "mp", "kougeki", "shubi_E", "kouma", "kaima", "kiyousa", "osharesa", "N",
    `return ${formula}`
  )

}