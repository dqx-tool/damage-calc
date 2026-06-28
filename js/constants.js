// 固定データ

// disable にする候補(applicable に追加すれば除外される)
export const targets = [
  // 呪文系
  "maryoku_damage_up_P",
  "mirazo_damage_up_P",
  "wand_150_damage_up_P",
  "reimyaku_damage_up_E",
  "weaponmi_damage_up_E",

  // タロット系
  "s100P_tarot_damage_up_P",
  "s160P_tarot_damage_up_P",
  "kon_tarot_damage_up_P",
  "suishou_tarot_damage_up_P",

  // 一部の特技系
  "damage_up_P_bonus",
  "thanatos_damage_up_P",
  "shuzoku_damage_up_P",
  "force_damage_up_P",

  // テンション系
  "tension_tension_P",
  "mugen_tension_plus_P",
  "kabu_tension_plus_P",
  "bu_lance_tension_plus_P",
  "bougu_tension_plus_P",
  "other_tension_plus_P",

  // スキル、宝珠Lv系
  "houju_spell_Lv_P",
  "sinzui_Lv_P",
  "weapon_spell_skill_Lv_P",
  "job_spell_skill_Lv_P",
  "skill_Lv_P",
  "houju_Lv_P",
  "houju_tarot_Lv_P",

  // その他
  "left_hand",
  "kaisin"
]

// 使用パラメータ → 入力ID対応
export const paramMap = {
  mp: ["mp"],
  kougeki: [
    "kougekiR",
    "kougekiL",
    "kougekiR_calculated",
    "kougekiL_calculated",
    "baiki",
    "gasin",
    "singun"
  ],
  kouma: ["kouma"],
  kaima: ["kaima"],
  kiyousa: ["kiyousa"],
  osharesa: ["osharesa"],
  N: [
    "kougekiR",
    "kougekiL",
    "kougekiR_calculated",
    "kougekiL_calculated",
    "baiki",
    "gasin",
    "singun",
    "shubi_E",
    "shubi_E_calculated",
    "rukani"]
}

// baiki がオンのときに参照するパラメータ
export const paramBaiki = [
  "tikara",
  "nitou",
  "weaponR_power",
  "weaponL_power",
  "kubi",
  "yubi",
  "mune",
  "hoka",
  "monshou",
  "akasi",
  "kokoro1_power",
  "kokoro2_power"
]

// 一部のスキルで参照するパラメータ
export const paramExtra = [
  "buff_count",
  "debuff_count",
  "tokugi_plus",
  "kaisin_plus",
  "shubi"
]