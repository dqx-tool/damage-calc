import { updateAll } from "../updateAll.js"



const KEEP_IDS = [
  "job_or_weapon_select",
  "skill_select"
]

const KEEP_RADIOS = [
  "job_or_weapon"
]

const RESET_GROUPS = {
  buff: [
    "baiki",
    "gasin",
    "singun",
    "nitou",
    "buff_count"
  ],
  tension: [
    "*_tension_plus_P",
    "*_tension_P",
    "sinzui_Lv_P",
  ],
  tarot: [
    "houju_tarot_Lv_P",
    "*_tarot_damage_up_P"
  ],
  attr_P: [
    "*_attr_P",
    "*_attr_input_P",
    "*_spell_skill_Lv_P",
    "houju_spell_Lv_P"
  ],
  damage_up_P: [
    "*_damage_up_P",
    "*_damage_up_input_P",
    "skill_Lv_P",
    "houju_Lv_P",
    "damage_up_P_bonus"
  ],
  attr_E: [
    "*_attr_E"
  ],
  damage_up_E: [
    "*_damage_up_E"
  ]
}



// RESET_GROUPS たちを 1 つの集合にする
function getResetGroupTargets() {

  const set = new Set()

  Object.values(RESET_GROUPS).forEach(group => {

    group.forEach(target => {

      if (target.startsWith("*_")) {
        // ワイルドカードは後で処理するので無視
        set.add(target)
      } else {
        set.add(target)
      }

    })
  })

  return set
}



// 各補正毎のリセット
function resetGroup(targets) {

  targets.forEach(target => {

    // *_xxxx 対応
    if (target.startsWith("*_")) {

      const suffix =
        target.slice(1)

      document
        .querySelectorAll("[id]")
        .forEach(el => {

          if (
            !el.id.endsWith(suffix)
          ) return

          resetElement(el)
        })

      return
    }

    // 通常id
    const el =
      document.getElementById(
        target
      )

    if (!el) return

    resetElement(el)
  })

  updateAll()
}

function resetElement(el) {

  // select
  if (el.tagName === "SELECT") {

    const hasZero =
      [...el.options]
        .some(
          o => o.value === "0"
        )

    if (hasZero) {
      el.value = "0"
    }
    else {
      el.selectedIndex = 0
    }
  }

  // checkbox
  else if (
    el.type === "checkbox"
  ) {

    el.checked = false
  }

  // radio
  else if (
    el.type === "radio"
  ) {

    el.checked = false
  }

  // input
  else {

    if (!el.readOnly) {
      el.value = ""
    }
  }

  trigger(el)
}



function trigger(el) {

  el.dispatchEvent(
    new Event("input", {
      bubbles: true
    })
  )

  el.dispatchEvent(
    new Event("change", {
      bubbles: true
    })
  )
}



function resetAll() {

  document
    .querySelectorAll("select, input")
    .forEach(el => {

      // KEEP_IDS除外
      if (KEEP_IDS.includes(el.id)) return

      // radioのKEEP_RADIOS除外
      if (
        el.type === "radio" &&
        KEEP_RADIOS.includes(el.name)
      ) return

      resetElement(el)
    })

  updateAll()
}



function applyMax(btn) {

  const el =
    document.getElementById(
      btn.dataset.max
    )

  if (!el) return



  // select
  if (el.tagName === "SELECT") {

    el.selectedIndex =
      btn.dataset.offset !== undefined
        ? el.options.length +
        Number(btn.dataset.offset)
        : el.options.length - 1
  }



  // input
  else if (
    el.tagName === "INPUT"
  ) {

    if (
      btn.dataset.value !==
      undefined
    ) {

      el.value =
        Number(btn.dataset.value)
    }
  }

  trigger(el)

  updateAll()
}



export function setupActionButtons() {

  document.addEventListener(
    "click",
    e => {

      // グループリセット
      const resetBtn =
        e.target.closest(
          ".reset-group-btn"
        )

      if (resetBtn) {

        const group =
          resetBtn.dataset
            .resetGroup

        const targets =
          RESET_GROUPS[group]

        if (targets) {

          resetGroup(targets)
        }

        return
      }
      


      // 全リセット
      if (
        e.target.id ===
        "reset_all_btn"
      ) {

        resetAll()

        return
      }


      
      // 補正リセット
      if (
        e.target.id ===
        "reset_select_btn"
      ) {

        const targets = getResetGroupTargets()

        if (targets) {

          resetGroup(targets)
        }

        return
      }



      const btn =
        e.target.closest(".max-btn")

      if (!btn) return

      applyMax(btn)
    }
  )
}