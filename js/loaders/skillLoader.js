import { state } from "../state.js"
import { buildTypeSelect, buildNameSelect } from "../ui/selectBuilder.js"
import { getSkillData } from "../skill/skillData.js"
import { compileFormula } from "../calc/formula.js"
import { updateSkillAutoCheck } from "../skill/autoCheck.js"
import { updateAll } from "../updateAll.js"
import { applyCommonSkillConfig, preprocessSkill } from "../skill/preprocess.js"
import { applyTarotDefaults } from "../skill/tarot.js"

// スキル読み込み
export async function loadTypeSelect() {

  const checked = document.querySelector(
    'input[name="job_or_weapon"]:checked'
  )

  const type = checked?.value

  const fileMap = {
    job: "data/job.json",
    weapon: "data/weapon.json",
    spell: "data/spell.json"
  }

  const res = await fetch(fileMap[type])
  state.jobWeaponData = await res.json()

  // 前処理
  Object.values(state.jobWeaponData).forEach(list => {
    list.forEach(skill => {
      preprocessSkill(skill, type)
    })
  })

  if (type === "job") {
    applyTarotDefaults(state.jobWeaponData)
  }

  applyCommonSkillConfig(state.jobWeaponData, type)

  buildTypeSelect(
    state.jobWeaponData,
    "job_or_weapon_select",
    loadSkillSelect
  )

  loadSkillSelect()
}

export async function loadJobWeapon() {

  document
    .querySelectorAll('input[name="job_or_weapon"]')
    .forEach(r => {
      r.addEventListener("change", async () => {

        await loadTypeSelect()
        updateAll()

      })
    })

  await loadTypeSelect()
}

// スキル select
export function loadSkillSelect() {

  buildNameSelect(
    state.jobWeaponData,
    "job_or_weapon_select",
    "skill_select",
    updateSkillData
  )

  updateSkillData()
}

// スキル更新
export function updateSkillData() {

  const skill = getSkillData()

  state.currentFormula =
    compileFormula(skill.formula)

  state.currentBuffRatio =
    compileFormula(skill.buff_ratio_formula)

  state.currentDebuffRatio =
    compileFormula(skill.debuff_ratio_formula)

  state.currentBuffRatioRatio =
    compileFormula(skill.buff_ratio_formula_ratio)

  state.currentDebuffRatioRatio =
    compileFormula(skill.debuff_ratio_formula_ratio)

  updateSkillAutoCheck()

  updateAll()

}