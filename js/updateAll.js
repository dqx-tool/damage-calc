import { getSkillData } from "./skill/skillData.js"
import { updateUIState } from "./ui/disabled.js"
import { updateResultLayout } from "./ui/resultLayout.js"
import { calculate } from "./calc/damage/damageCalc.js"


export function updateAll() {

  const skill = getSkillData()

  if (!skill) return

  updateUIState(skill)

  updateResultLayout(skill)

  calculate()
}