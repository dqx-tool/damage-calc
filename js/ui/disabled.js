import { targets, paramMap, paramBaiki, paramExtra } from "../constants.js"
import { getUsedParams } from "../skill/usedParams.js"
import { val } from "../utils.js"


// formula に登場しうる param
export const allParamIds = [
  ...new Set(Object.values(paramMap).flat())
]

// disabled 対象すべて
export const allDisableTargets = [
  ...new Set([
    ...targets,
    ...paramBaiki,
    ...paramExtra,
    ...allParamIds
  ])
]

// disabled 同期
export function setDisabled(id, disabled) {

  // main element
  const el = document.getElementById(id)
  
  if (el) {
    el.disabled = disabled
  }

  // checkbox
  const cb = document.querySelector(
    `input[data-target="${id}"]`
  )

  if (cb) {
    cb.disabled = disabled
  }

  // max/phala buttons
  document
    .querySelectorAll(`[data-max="${id}"]`)
    .forEach(btn => {
      btn.disabled = disabled
    })

  // wrapper (optional)
  const wrapper = document.querySelector(
    `[data-wrapper="${id}"]`
  )

  if (wrapper) {
    wrapper.classList.toggle(
      "disabled-wrapper",
      disabled
    )
  }

  // disabled な項目はグレーアウト
  if (el) {
    el.disabled = disabled

    // row
    const row = el.closest("tr")

    // result-table は除外
    if (row && !row.closest(".no-disabled-style")) {
      row.classList.toggle(
        "disabled-row",
        disabled
      )
    }
  }
}


// applicable 判定
function isApplicable(id, skill) {

  const applicable = skill.applicable || []

  // param only input は applicable 無視
  if (!targets.includes(id)) {
    return true
  }

  return applicable.includes(id)
}

// param 判定
function isRequiredByFormula(id, skill) {

  // paramMap に無いものは
  // formula判定不要
  if (!allParamIds.includes(id)) {
    return true
  }

  const usedParams = getUsedParams(skill)

  return usedParams.some(param => {
    return paramMap[param]?.includes(id)
  })
}

// 条件判定
function passesExtraConditions(id, skill) {
  
  const leftHand =
    document.getElementById("left_hand")?.checked

  const kaisinCheck =
    document.getElementById("kaisin")?.checked

  const baiki = val("baiki")

  const singun = val("singun")

  const kaisinType = skill.kaisin || 0

  const paramLeft = [
    "kougekiL",
    "kougekiL_calculated"
  ]

  const paramBaikiLeft = [
    "weaponL_power",
    "nitou"
  ]

  // 左手系
  if (paramLeft.includes(id) && !leftHand) {
    return false
  }

  // バイキ系
  if (paramBaiki.includes(id) && baiki === 0) {
    return false
  }

  // バイキかつ左手系
  if (paramBaikiLeft.includes(id) && (baiki === 0 || !leftHand)) {
    return false
  }

  // 会心系
  if (id === "kaisin_plus" && !kaisinCheck) {
    return false
  }

  // 鉄壁の進軍
  if (id === "shubi" && singun === 0) {
    return false
  }

  // 通常攻撃
  if (id === "tokugi_plus" && kaisinType === -1) {
    return false
  }

  // buff系
  if (id === "buff_count" && !(skill.buff_ratio_formula || skill.buff_ratio_formula_ratio)) {
    return false
  }

  // debuff系
  if (id === "debuff_count" && !(skill.debuff_ratio_formula || skill.debuff_ratio_formula_ratio)) {
    return false
  }

  return true
}

// 最終enabled判
export function isEnabled(id, skill) {

  if (!skill) return false

  return (
    isApplicable(id, skill)
    && isRequiredByFormula(id, skill)
    && passesExtraConditions(id, skill)
  )
}

// UI更新
export function updateUIState(skill) {
  if (!skill) return

  allDisableTargets.forEach(id => {

    const enabled = isEnabled(id, skill)

    setDisabled(id, !enabled)

  })
}