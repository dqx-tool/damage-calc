import { expandPattern, mergeArray } from "../utils.js"
import { targets } from "../constants.js"

// スキル前処理
export function preprocessSkill(skill, type) {

  // skill_point が無いなら除外対象に追加
  addRemoveIfMissing(skill, "skill_point", "skill_Lv_P")

  // spell_weapon_skill_point が無いなら除外対象に追加
  addRemoveIfMissing(skill, "spell_weapon_skill_point", "weapon_spell_skill_Lv_P")

  // spell_job_skill_point が無いなら除外対象に追加
  addRemoveIfMissing(skill, "spell_job_skill_point", "job_spell_skill_Lv_P")

  // houju_spell が無いなら除外対象に追加
  addRemoveIfMissing(skill, "houju_spell", "houju_spell_Lv_P")

  // houju が無いなら除外対象に追加
  addRemoveIfMissing(skill, "houju", "houju_Lv_P")

  // houju_tarot が無いなら除外対象に追加
  addRemoveIfMissing(skill, "houju_tarot", "houju_tarot_Lv_P")

  // sinzui が無いなら除外対象に追加
  addRemoveIfMissing(skill, "sinzui", "sinzui_Lv_P")

  // 呪文会心
  if (type === "spell") {
    skill.kaisin ??= 2
  }

  // 宝珠を最初からMAX
  const houjuAutoSelectMap = {
    houju: "houju_Lv_P",
    houju_spell: "houju_spell_Lv_P",
    houju_tarot: "houju_tarot_Lv_P"
  }

  Object.entries(houjuAutoSelectMap).forEach(([sourceKey, targetKey]) => {

    if (skill[sourceKey] != null) {

      skill.auto_select ??= {}

      skill.auto_select[targetKey] ??= "6"

    }

  })

}

// .json の中で checkKey という項目がなければ removeTarget を remove_applicable に追加
function addRemoveIfMissing(skill, checkKey, removeTarget) {
  if (!(checkKey in skill)) {
    skill.remove_applicable = [
      ...(skill.remove_applicable || []),
      removeTarget
    ]
  }
}

// 共通 applicable
export function applyCommonSkillConfig(data, type) {

  const commonSkillConfig = {

    spell: {
      applicable: [
        "maryoku_damage_up_P",
        "mirazo_damage_up_P",
        "reimyaku_damage_up_E",
        "weaponmi_damage_up_E",
        "kaisin",
        "tension_tension_P",
        "*_plus_P",
        "*_Lv_P",
        "*_attr_P",
        "*_attr_input_P",
        "*_attr_E"
      ],

      auto_check: [
        "maryoku_damage_up_P",
        "kaisin"
      ]
    },

    job: {
      applicable: [
        "left_hand",
        "kaisin",
        "tension_tension_P",
        "*_plus_P",
        "*_Lv_P",
        "*_attr_P",
        "*_attr_input_P",
        "*_attr_E"
      ]
    },

    weapon: {
      applicable: [
        "left_hand",
        "kaisin",
        "tension_tension_P",
        "*_plus_P",
        "*_Lv_P",
        "*_attr_P",
        "*_attr_input_P",
        "*_attr_E"
      ]
    }

  }

  const config = commonSkillConfig[type]

  if (!config) return

  Object.values(data).forEach(list => {
    list.forEach(skill => {

      // applicable
      const expandedApplicable =
        expandPattern(config.applicable, targets)

      mergeArray(
        skill,
        "applicable",
        expandedApplicable
      )

      // auto_check
      if (config.auto_check) {

        mergeArray(
          skill,
          "auto_check",
          config.auto_check
        )

      }

      // remove_applicable
      const expandedRemove =
        expandPattern(skill.remove_applicable, targets)

      if (expandedRemove.length && skill.applicable) {

        skill.applicable =
          skill.applicable.filter(
            id => !expandedRemove.includes(id)
          )

      }

      // remove_auto_check
      if (skill.remove_auto_check && skill.auto_check) {

        skill.auto_check =
          skill.auto_check.filter(
            id => !skill.remove_auto_check.includes(id)
          )

      }

    })
  })

}