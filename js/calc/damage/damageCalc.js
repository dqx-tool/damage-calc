import { createDamageContext } from "./damageContext.js"
import { calculateDamage } from "./damageCore.js"
import { renderDamage } from "./renderer.js"

// ダメージ計算
export function calculate() {

  document
    .querySelectorAll(".result-table span")
    .forEach(el => el.textContent = "")

  const ctx = createDamageContext()

  if (!ctx) return

  const result = calculateDamage(ctx)

  renderDamage(result)
}