import { callFormula, createFormulaParams } from "./formula.js"
import { applyKaisin } from "./kaisin.js"
import { applyTension } from "./tension.js"
import { safeFloor } from "./rounding.js"

// 共通ヒット計算エンジン
function calcHand({
  isLeft,
  kougeki,
  kougeki_basic,
  hits,
  params,
  Nn,
  Nm,
  NM,
  state,
  ratio,
  skill,
  R,
  total_plus,
  kaisin_check,
  limit_check,
  shubi_E,
  rr,
  rf
}) {

  const result = []

  let total_n = 0
  let total_m = 0
  let total_M = 0

  hits.forEach((r, i) => {

    let base = [
      callFormula(state.currentFormula, [...params, Nn(kougeki)]) * r,
      callFormula(state.currentFormula, [...params, Nm(kougeki)]) * (r - rr) - rf,
      callFormula(state.currentFormula, [...params, NM(kougeki)]) * (r + rr) + rf
    ]

    // テンション（左手は無し）
    if (!isLeft && i === 0) {
      base = applyTension({
        base,
        tension_P: 1 + ratio.total_tension_P,
        firstHit: true
      })
    }

    // 会心処理
    if (kaisin_check) {

      // 左手は特殊制限あり
      if (isLeft) {

        if (skill.kaisin === -1) {

          const baseA = !skill.kaisin_ratio ?
            [
              kougeki_basic * Math.min(r, 1),
              kougeki_basic * Math.min(r - rr, 1) * 0.95,
              kougeki_basic * Math.min(r + rr, 1) * 1.05
            ]
          :
            [
              kougeki_basic * skill.kaisin_ratio,
              kougeki_basic * skill.kaisin_ratio * 0.95,
              kougeki_basic * skill.kaisin_ratio * 1.05
            ]

          const baseB = [
            base[0] * 1.2 * 2.15,
            base[1] * 1.2 * 0.95 * 2,
            base[2] * 1.2 * 1.05 * 2.3
          ]

          for (let j = 0; j < 3; j++) {
            base[j] = Math.max(baseA[j], baseB[j]) * 0.7
          }
        }

      } else {

        base = applyKaisin({
          base,
          skill,
          kaisin_type: skill.kaisin || 0,
          kougeki_basic,
          r,
          rr
        })
      }
    }

    let d = base.map(v => v * R)

    // 左手は常時0.7補正（通常以外）
    if (isLeft && skill.formula !== "N") {
      d = d.map(v => v * 0.7)
    }
    
    d = d.map(v => safeFloor(v + total_plus))

    if (!isLeft && i === 0 && ratio.total_tension_P !== 0) {
      d = d.map(v => v + ratio.total_tension_plus)
    }

    // 準必中チェック
    if (skill.formula === "N" && !kaisin_check && kougeki < shubi_E / 2 + 2) {
      d = [0, 0, 1]
    }

    if (limit_check) {
      d = d.map(v => Math.min(v, skill.limit || 9999))
    }

    result.push(d)

    total_n += d[0]
    total_m += d[1]
    total_M += d[2]
  })

  return { result, total_n, total_m, total_M }
}

export function calculateDamage(ctx) {

  const {
    status: s,
    ratio,
    skill,
    state,
    kaisin_check,
    limit_check,
    tokugi_plus,
    kaisin_plus,
    thanatos_plus,
    shuzoku_plus
  } = ctx

  const mp = s.mp || 0
  const shubi_E = s.shubi_E_calculated || 0

  const kouma = s.kouma || 0
  const kaima = s.kaima || 0
  const kiyousa = s.kiyousa || 0
  const osharesa = s.osharesa || 0

  const kougekiR = s.kougekiR_calculated || 0
  const kougekiR_basic = s.kougekiR || 0

  const kougekiL = s.kougekiL_calculated || 0
  const kougekiL_basic = s.kougekiL || 0

  const paramsR = createFormulaParams({
    mp,
    kougeki: kougekiR,
    shubi_E,
    kouma,
    kaima,
    kiyousa,
    osharesa
  })

  const paramsL = createFormulaParams({
    mp,
    kougeki: kougekiL,
    shubi_E,
    kouma,
    kaima,
    kiyousa,
    osharesa
  })

  const base = k => k / 2 - shubi_E / 4
  const isHicchuu = k => k < shubi_E * 4 / 7
  const semiHicchuu = k => k / 16

  const Nn = k =>
    isHicchuu(k)
      ? Math.round(semiHicchuu(k) / 2)
      : Math.round(base(k))

  const Nm = k =>
    isHicchuu(k)
      ? 0
      : Math.round(base(k) * 15 / 16 - 1)

  const NM = k =>
    isHicchuu(k)
      ? Math.round(semiHicchuu(k))
      : Math.round(base(k) * 17 / 16 + 1)
  
  const hits = skill.ratio ?? Array(skill.times ?? 1).fill(1)

  const total_plus =
    tokugi_plus +
    kaisin_plus +
    thanatos_plus +
    shuzoku_plus +
    (skill.bonus_plus || 0) +
    ratio.tokugi_bonus_plus

  const R =
    (1 + ratio.total_attr_P) *
    (1 + ratio.total_damage_up_P) *
    (1 + ratio.total_houju_tarot_P) *
    (1 + ratio.total_damage_up_E) *
    (1 + ratio.total_attr_E)

  const rr = skill.random_r ?? 0
  const rf = skill.random ?? 0

  // 右手
  const rightRes = calcHand({
    isLeft: false,
    kougeki: kougekiR,
    kougeki_basic: kougekiR_basic,
    hits,
    params: paramsR,
    Nn,
    Nm,
    NM,
    state,
    ratio,
    skill,
    R,
    total_plus,
    kaisin_check,
    limit_check,
    shubi_E,
    rr,
    rf
  })

  // 左手
  let left = []

  if (ctx.leftHand) {

    const hitsL =
      skill.name === "ツメ、はやぶさの剣、聖王のナイフ etc."
        ? [...hits].reverse()
        : [hits[0]]

    const leftRes = calcHand({
      isLeft: true,
      kougeki: kougekiL,
      kougeki_basic: kougekiL_basic,
      hits: hitsL,
      params: paramsL,
      Nn,
      Nm,
      NM,
      state,
      ratio,
      skill,
      R,
      total_plus,
      kaisin_check,
      limit_check,
      shubi_E,
      rr,
      rf
    })

    left = leftRes.result
  }

  return {
    right: rightRes.result,
    left,
    total: {
      n: rightRes.total_n + (ctx.leftHand ? left.reduce((a, b) => a + b[0], 0) : 0),
      m: rightRes.total_m + (ctx.leftHand ? left.reduce((a, b) => a + b[1], 0) : 0),
      M: rightRes.total_M + (ctx.leftHand ? left.reduce((a, b) => a + b[2], 0) : 0)
    }
  }
}