import { calculate_status } from "../statusCalc.js"
import { calculate_ratio } from "../ratioCalc.js"
import { getSkillData } from "../../skill/skillData.js"
import { state } from "../../state.js"
import { val } from "../../utils.js"

export function createDamageContext() {

  const s = calculate_status()
  if (!s) return null

  const ratio = calculate_ratio()
  if (!ratio) return null

  const skill = getSkillData()
  if (!skill) return null

  return {
    state,
    skill,
    ratio,
    status: s,

    kaisin_check:
      document.getElementById("kaisin").checked,

    leftHand:
      document.getElementById("left_hand").checked,

    limit_check:
      document.getElementById("limit").checked,

    buff_count:
      val("buff_count") || 0,

    debuff_count:
      val("debuff_count") || 0,

    tokugi_plus:
      skill.kaisin !== -1 ? s.tokugi_plus || 0 : 0,

    kaisin_plus:
      document.getElementById("kaisin").checked ? s.kaisin_plus || 0 : 0,

    thanatos_plus:
      10 * Math.floor(val("thanatos_damage_up_P")),

    shuzoku_plus:
      10 * val("shuzoku_damage_up_P")
  }
}