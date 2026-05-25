import { mergeArray, mergeObject } from "../utils.js"

// 占い師専用処理
export function applyTarotDefaults(data) {

  if (!data["占い師"]) return

  const tarotDefaults = {
    applicable: [
      "s100P_tarot_damage_up_P",
      "s160P_tarot_damage_up_P",
      "kon_tarot_damage_up_P",
      "suishou_tarot_damage_up_P"
    ],

    auto_select: {
      "s100P_tarot_damage_up_P": "3",
      "s160P_tarot_damage_up_P": "0.5",
      "suishou_tarot_damage_up_P": "2"
    }
  }

  data["占い師"].forEach(skill => {

    mergeArray(
      skill,
      "applicable",
      tarotDefaults.applicable
    )

    mergeObject(
      skill,
      "auto_select",
      tarotDefaults.auto_select
    )

  })

}