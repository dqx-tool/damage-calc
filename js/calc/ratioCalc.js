import { getSkillData } from "../skill/skillData.js"
import { sumPercentValues, formatHalf } from "../utils.js"

// 補正倍率計算
export function calculate_ratio() {
  const skill = getSkillData()
  if (!skill) return

  // 各倍率
  const attr_P = sumPercentValues('[id$="_attr_P"]') + sumPercentValues('[id$="_attr_input_P"]') / 100 || 0
  const tension_P = sumPercentValues('[id$="_tension_P"]')
  const tension_plus = sumPercentValues('[id$="_tension_plus_P"]')
  const damage_up_P = sumPercentValues('[id$="_damage_up_P"]') + sumPercentValues('[id$="_damage_up_input_P"]') / 100 || 0
  const damage_up_E = sumPercentValues('[id$="_damage_up_E"]')
  const attr_E = sumPercentValues('[id$="_attr_E"]')

  const input_attr_E =
    Number(
      document.querySelector("#taisei_enemy_input_attr input")?.value
    ) / 100 || 0

  // 特技ボーナス
  const tokugi_bonus = document.getElementById("damage_up_P_bonus").value
  let tokugi_bonus_ratio = 0
  let tokugi_bonus_plus = 0

  if (tokugi_bonus === "shuzoku") {
    tokugi_bonus_ratio = 0.5
    tokugi_bonus_plus = 5
  }
  else if (tokugi_bonus === "thanatos") {
    tokugi_bonus_ratio = 1.7
    tokugi_bonus_plus = 10
  }
  else if (tokugi_bonus === "kaisin_hicchuu") {
    tokugi_bonus_ratio = 1.5
  }
  else if (tokugi_bonus === "seigi_A") {
    tokugi_bonus_ratio = 1.25
  }
  else if (tokugi_bonus === "seigi_aura") {
    tokugi_bonus_ratio = 2
  }

  // 宝珠
  const houjuLv = Number(document.getElementById("houju_Lv_P")?.value || 0)
  const houju_P = houjuLv * (skill.houju ?? 0)

  const houjuJumonLv = Number(document.getElementById("houju_spell_Lv_P")?.value || 0)
  const houju_spell_P = houjuJumonLv * (skill.houju_spell ?? 0)

  const houjuTarotLv = Number(document.getElementById("houju_tarot_Lv_P")?.value || 0)
  const houju_tarot_P = houjuTarotLv * (skill.houju_tarot ?? 0)

  // 真髄
  const sinzuiLv = Number(document.getElementById("sinzui_Lv_P")?.value || 0)
  const sinzui_P = sinzuiLv * (skill.sinzui ?? 0)

  // スキルポイント
  const skill_Lv = Number(document.getElementById("skill_Lv_P")?.value || 0)
  const skill_P = (skill.skill_point ?? [])[skill_Lv] ?? 0

  const spell_weapon_skill_Lv = Number(document.getElementById("weapon_spell_skill_Lv_P")?.value || 0)
  const spell_weapon_skill_P = (skill.spell_weapon_skill_point ?? [])[spell_weapon_skill_Lv] ?? 0

  const spell_job_skill_Lv = Number(document.getElementById("job_spell_skill_Lv_P")?.value || 0)
  const spell_job_skill_P = (skill.spell_job_skill_point ?? [])[spell_job_skill_Lv] ?? 0

  // 各種補正倍率
  const total_attr_P = attr_P + houju_spell_P + spell_weapon_skill_P + spell_job_skill_P
  const total_tension_P = tension_P
  const total_tension_plus = tension_plus + sinzui_P
  const total_damage_up_P = damage_up_P + houju_P + skill_P + tokugi_bonus_ratio
  const total_houju_tarot_P = houju_tarot_P
  const total_damage_up_E = damage_up_E
  const total_attr_E = attr_E + input_attr_E

  const set = (id, v) => {
    const el = document.getElementById(id)
    if (el) el.value = v
  }

  function total_textContent_percent(id, v) {
    document.getElementById(id).textContent =
      v >= 0 ? "+" + formatHalf(v * 100) + "%" : formatHalf(v * 100) + "%"
  }

  function total_textContent_value(id, v) {
    document.getElementById(id).textContent =
      v >= 0 ? "+" + formatHalf(v) : formatHalf(v)
  }

  total_textContent_percent("attr_P_total", total_attr_P)
  total_textContent_value("tension_plus_total", total_tension_plus)
  total_textContent_percent("damage_up_P_total", total_damage_up_P)
  total_textContent_percent("houju_tarot_P_total", total_houju_tarot_P)
  total_textContent_percent("damage_up_E_total", total_damage_up_E)
  total_textContent_percent("attr_E_total", total_attr_E)

  return {
    total_attr_P,
    total_tension_P,
    total_tension_plus,
    total_damage_up_P,
    total_houju_tarot_P,
    total_damage_up_E,
    total_attr_E,
    tokugi_bonus_plus
  }

}