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

  // select
  document
    .querySelectorAll("select")
    .forEach(select => {

      if (
        KEEP_IDS.includes(select.id)
      ) return

      select.selectedIndex = 0

      trigger(select)
    })



  // checkbox
  document
    .querySelectorAll(
      'input[type="checkbox"]'
    )
    .forEach(checkbox => {

      checkbox.checked = false

      trigger(checkbox)
    })



  // input
  document
    .querySelectorAll(
      'input[type="number"]'
    )
    .forEach(input => {

      if (input.readOnly) return

      input.value = ""

      trigger(input)
    })



  // radio
  document
    .querySelectorAll(
      'input[type="radio"]'
    )
    .forEach(radio => {

      if (
        KEEP_RADIOS.includes(
          radio.name
        )
      ) return

      radio.checked = false

      trigger(radio)
    })

  updateAll()
}



function resetBuffSelects() {

  document
    .querySelectorAll("select")
    .forEach(select => {

      if (
        [
          ...KEEP_IDS,
          "enemy_type_select",
          "enemy_name_select"
        ].includes(select.id)
      ) return

      const hasZero =
        [...select.options]
          .some(
            o => o.value === "0"
          )

      if (!hasZero) return

      select.value = "0"

      trigger(select)
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

        resetBuffSelects()

        return
      }



      const btn =
        e.target.closest(".max-btn")

      if (!btn) return

      applyMax(btn)
    }
  )
}