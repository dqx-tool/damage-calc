import { paramMap } from "../constants.js"

export function getUsedParams(skill) {

  if (!skill) return []

  const formulas = [
    skill.formula,
    skill.buff_ratio_formula,
    skill.debuff_ratio_formula,
    skill.buff_ratio_formula_ratio,
    skill.debuff_ratio_formula_ratio
  ]

  const used = new Set()

  formulas.forEach(formula => {

    if (typeof formula !== "string") return

    Object.keys(paramMap).forEach(param => {

      if (formula.includes(param)) {
        used.add(param)
      }

    })

  })

  const usedArray = [...used]

  return usedArray
}