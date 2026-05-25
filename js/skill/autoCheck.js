import { state } from "../state.js"
import { targets } from "../constants.js"
import { getSkillData } from "../skill/skillData.js"

// job.json または weapon.json の auto_check の項目を初期状態でオン
export function updateSkillAutoCheck() {

  const skill = getSkillData()
  if (!skill) return

  // 前のauto_checkをリセット
  if (state.previousSkill?.auto_check) {

    state.previousSkill.auto_check.forEach(id => {

      const cb = document.querySelector(`input[data-target="${id}"]`)
      const sel = document.getElementById(id)

      if (cb) {
        cb.checked = false
        cb.dispatchEvent(new Event("change"))
      }

      if (sel) {
        sel.selectedIndex = 0
        sel.dispatchEvent(new Event("change"))
      }

    })

  }

  // applicable以外をリセット
  const applicable = skill.applicable || []

  targets.forEach(id => {

    if (!applicable.includes(id)) {

      const cb = document.querySelector(`input[data-target="${id}"]`)
      const sel = document.getElementById(id)

      if (cb) {
        cb.checked = false
        cb.dispatchEvent(new Event("change"))
      }

      if (sel) {
        sel.selectedIndex = 0
        sel.dispatchEvent(new Event("change"))
      }

    }

  })

  // auto_checkをON
  if (skill.auto_check) {

    skill.auto_check.forEach(id => {

      const cb = document.querySelector(`input[data-target="${id}"]`)
      const sel = document.getElementById(id)

      if (cb) {
        cb.checked = true
        cb.dispatchEvent(new Event("change"))
      }

      if (sel && sel.options && sel.options.length > 0) {
        sel.selectedIndex = sel.options.length - 1
        sel.dispatchEvent(new Event("change"))
      }

    })

  }

  // auto_select適用
  applySkillAutoSelect(skill)

  // 次回用
  state.previousSkill = skill
}

// job.json または weapon.json の auto_select を適用
function applySkillAutoSelect(skill) {

  if (!skill?.auto_select) return

  Object.entries(skill.auto_select).forEach(([selectId, value]) => {

    const sel = document.getElementById(selectId)

    if (!sel) return

    // value一致する option がある場合のみ変更
    const exists = [...sel.options].some(
      option => option.value === value
    )

    if (!exists) return

    sel.value = value

    sel.dispatchEvent(
      new Event("change", { bubbles: true })
    )

  })
}