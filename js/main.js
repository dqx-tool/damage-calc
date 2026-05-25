// 初期化に関するファイル

import { loadHTML } from "./loaders/htmlLoader.js"
import { setupTableBuffHighlight } from "./ui/highlight.js"
import { setupManualInput } from "./ui/manualInput.js"
import { setupCheckbox } from "./ui/checkbox.js"
import { setupActionButtons } from "./ui/buttons.js"
import { loadEquipment } from "./loaders/equipmentLoader.js"
import { loadEnemy } from "./loaders/enemyLoader.js"
import { loadTypeSelect } from "./loaders/skillLoader.js"
import { updateAll } from "./updateAll.js"
import { calculate } from "./calc/damage/damageCalc.js"
import { loadJobWeapon } from "./loaders/skillLoader.js"
import { initSaveManager } from "./saveManager.js"

init()

async function init() {
  const tables = [
    "status_P",
    "attr_P",
    "tension_P",
    "damage_up_P",
    "damage_up_E",
    "attr_E",
    "equipment_P",
    "status_E",
    "result",
    "damage_calc"
  ]

  await Promise.all(
    tables.map(t => loadHTML(`tables/${t}.html`, t))
  )

  setupTableBuffHighlight(".info-table")

  setupManualInput()
  setupCheckbox()
  setupRealtimeCalc()
  setupActionButtons()

  await loadEquipment()
  await loadEnemy()
  await loadTypeSelect()
  await loadJobWeapon()

  initSaveManager(updateAll)

  updateAll()
}

// リアルタイム計算
function setupRealtimeCalc() {

  document.addEventListener("input", e => {
    if (e.target.matches('input[type="number"]')) {
      calculate()
    }
  })

  document.addEventListener("change", e => {
    if (e.target.matches('input[type="checkbox"], select')) {
      updateAll()
    }

  })

}