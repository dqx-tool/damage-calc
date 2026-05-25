import { buildTypeSelect, buildNameSelect }
  from "../ui/selectBuilder.js"

import { updateAll }
  from "../updateAll.js"

import { state }
  from "../state.js"

// 敵読み込み
export async function loadEnemy() {

  const res = await fetch("data/enemies.json")

  state.enemyData = await res.json()

  buildTypeSelect(
    state.enemyData,
    "enemy_type_select",
    loadEnemyNameSelect
  )

  loadEnemyNameSelect()
}

// 敵名 select
export function loadEnemyNameSelect() {

  buildNameSelect(
    state.enemyData,
    "enemy_type_select",
    "enemy_name_select",
    updateEnemyData
  )

  updateEnemyData()
}

// 敵データ更新
export function updateEnemyData() {

  const type =
    document.getElementById("enemy_type_select").value

  const name =
    document.getElementById("enemy_name_select").value

  const enemy =
    state.enemyData[type]?.find(
      e => e.name === name
    )

  // 守備力
  const shubiInput =
    document.getElementById("shubi_E")

  if (!shubiInput) return

  shubiInput.value =
    enemy?.shubi ?? ""

  shubiInput.readOnly =
    type !== "手動入力"
  
  // HP表示
  const hpSpan =
    document.getElementById("HP_E")

  if (hpSpan) {

    const hp = enemy?.HP

    hpSpan.innerHTML =
      typeof hp === "number"
        ? hp.toLocaleString()
        : (hp ?? "")
  }

  updateAll()
}
