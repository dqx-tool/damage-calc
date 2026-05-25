import { state } from "../state.js"

// 計算する skill を返す関数
export function getSkillData() {

  const typeSelect =
    document.getElementById("job_or_weapon_select")

  const skillSelect =
    document.getElementById("skill_select")

  if (!typeSelect || !skillSelect) {
    return null
  }

  const typeName = typeSelect.value
  const skillName = skillSelect.value

  const skill =
    state.jobWeaponData[typeName]?.find(
      s => s.name === skillName
    )

  return skill || null
}