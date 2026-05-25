export function applyKaisin({
  base,
  skill,
  kaisin_type,
  kougeki_basic,
  r,
  rr,
  tension_P
}) {

  // 呪文
  if (kaisin_type === 2) {

    return [
      base[0] * 2.3,
      base[1] * 2.2,
      base[2] * 2.4
    ]
  }

  // 通常単体会心
  if (skill.formula === "N" && kaisin_type !== 1) {

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
      base[0] * 1.2,
      base[1] * 1.2 * 0.95,
      base[2] * 1.2 * 1.05
    ]

    return base.map((_, i) => Math.max(baseA[i], baseB[i]))
  }

  return [
    base[0] * 1.4,
    base[1] * 1.2,
    base[2] * 1.6
  ]
}