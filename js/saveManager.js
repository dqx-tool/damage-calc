import { loadTypeSelect, loadSkillSelect, updateSkillData } from "./loaders/skillLoader.js"
import { loadEnemyNameSelect, updateEnemyData } from "./loaders/enemyLoader.js"
import { updateTableBuffHighlight } from "./ui/highlight.js"



const STORAGE_KEY = "dqx_damage_calc_saves"

const KEYMAP = {

  job_or_weapon: "0",
  job_or_weapon_select: "1",
  skill_select: "2",
  left_hand: "3",
  limit: "4",
  kaisin: "5",
  mp: "6",
  kougekiR: "7",
  kougekiL: "8",
  shubi: "9",
  kouma: "a",
  kaima: "b",
  tikara: "c",
  kiyousa: "d",
  osharesa: "e",
  kougekiR_calculated: "f",
  kougekiL_calculated: "g",
  tokugi_plus: "h",
  kaisin_plus: "i",
  baiki: "j",
  gasin: "k",
  singun: "l",
  nitou: "m",
  buff_count: "n",
  tension_tension_P: "o",
  mugen_tension_plus_P: "p",
  kabu_tension_plus_P: "q",
  sinzui_Lv_P: "r",
  bu_lance_tension_plus_P: "s",
  bougu_tension_plus_P: "t",
  other_tension_plus_P: "u",
  houju_tarot_Lv_P: "v",
  s100P_tarot_damage_up_P: "w",
  s160P_tarot_damage_up_P: "x",
  kon_tarot_damage_up_P: "y",
  suishou_tarot_damage_up_P: "z",
  weapon_attr_P: "10",
  bougu_attr_P: "11",
  tibou_attr_P: "12",
  danzai_attr_P: "13",
  belt_attr_P: "14",
  kokoro1_attr_P: "15",
  weapon_skill_attr_input_P: "16",
  job_skill_attr_input_P: "17",
  weapon_spell_skill_Lv_P: "18",
  job_spell_skill_Lv_P: "19",
  houju_spell_Lv_P: "1a",
  element_boost_attr_P: "1b",
  drago_attr_P: "1c",
  other_attr_input_P: "1d",
  weapon_damage_up_P: "1e",
  danzai_damage_up_P: "1f",
  belt_damage_up_P: "1g",
  skill_Lv_P: "1h",
  houju_Lv_P: "1i",
  all_damage_up_input_P: "1j",
  gadget_damage_up_P: "1k",
  warcry_damage_up_P: "1l",
  phala_damage_up_P: "1m",
  mini_damage_up_P: "1n",
  maryoku_damage_up_P: "1o",
  mirazo_damage_up_P: "1p",
  wand_150_damage_up_P: "1q",
  damage_up_P_bonus: "1r",
  force_damage_up_P: "1s",
  moukou_damage_up_P: "1t",
  kaikyuu_damage_up_P: "1u",
  other_damage_up_input_P: "1v",
  weaponR_power: "1w",
  weaponL_power: "1x",
  kubi: "1y",
  kubi_power: "1z",
  yubi: "20",
  yubi_power: "21",
  mune: "22",
  mune_power: "23",
  hoka: "24",
  hoka_power: "25",
  monshou: "26",
  monshou_power: "27",
  akasi: "28",
  akasi_power: "29",
  kokoro1_power: "2a",
  enemy_type_select: "2b",
  enemy_name_select: "2c",
  shubi_E: "2d",
  rukani: "2e",
  shubi_E_calculated: "2f",
  debuff_count: "2g",
  taisei_attr_E: "2h",
  fb_attr_E: "2i",
  down_attr_E: "2j",
  revol_damage_up_E: "2k",
  saika_damage_up_E: "2l",
  gusha_damage_up_E: "2m",
  reimyaku_damage_up_E: "2n",
  weaponmi_damage_up_E: "2o",
  phala_damage_up_E: "2p",
  save_name: "2q",
  save_list: "2r",
  import_file: "2s",
  kokoro2_attr_P: "2t",
  kokoro2_power: "2u",

}

const REVERSE_KEYMAP =
  Object.fromEntries(
    Object.entries(KEYMAP)
      .map(([k, v]) => [v, k])
  )

// 保存する際保持しなくてよいデータ
const IGNORE_IDS = [
  "save_list",
  "import_file"
]


/* ============================
   不要値判定
============================ */

function isDefaultValue(value) {

  // 空文字
  if (value === "") {
    return true
  }

  // false
  if (value === false) {
    return true
  }

  // 0
  if (
    value === 0 ||
    value === "0"
  ) {
    return true
  }

  return false
}



/* ============================
   フォーム取得
============================ */

export function getFormData() {

  const data = {}

  document
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach(el => {

      if (!el.id && !el.name) {
        return
      }

      if (IGNORE_IDS.includes(el.id)) {
        return
      }



      /* =====================
         checkbox
      ===================== */

      if (el.type === "checkbox") {

        const value = el.checked

        // trueだけ保存
        if (!isDefaultValue(value)) {

          data[el.id] = value
        }
      }



      /* =====================
         radio
      ===================== */

      else if (el.type === "radio") {

        if (el.checked) {

          const value = el.value

          if (!isDefaultValue(value)) {

            data[el.name] = value
          }
        }
      }



      /* =====================
         その他
      ===================== */

      else {

        const value = el.value

        if (!isDefaultValue(value)) {

          data[el.id] = value
        }
      }
    })

  const compressed = {}

  Object.entries(data)
    .forEach(([key, value]) => {

      const shortKey =
        KEYMAP[key] || key

      compressed[shortKey] =
        value
    })

  return compressed
}



/* ============================
   フォーム反映
============================ */

export async function setFormData(data) {

  /* =========================
   0. 全初期化
  ========================= */

  document
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach(el => {

      // checkbox
      if (el.type === "checkbox") {
        el.checked = false
      }

      // radio
      else if (el.type === "radio") {
        el.checked = false
      }

      // select
      else if (el.tagName === "SELECT") {
        el.selectedIndex = 0
      }

      // readonly以外input
      else if (!el.readOnly) {
        el.value = ""
      }
    })

  const restored = {}

  Object.entries(data)
    .forEach(([key, value]) => {

      const originalKey =
        REVERSE_KEYMAP[key] || key

      restored[originalKey] =
        value
    })

  data = restored

  /* =========================
     1. radio復元
  ========================= */

  document
    .querySelectorAll('input[type="radio"]')
    .forEach(el => {

      if (!(el.name in data)) return

      el.checked =
        data[el.name] === el.value
    })



  /* =========================
     2. radio依存select生成
  ========================= */

  await loadTypeSelect()



  /* =========================
     3. type select復元
  ========================= */

  const typeSelect =
    document.getElementById(
      "job_or_weapon_select"
    )

  if (
    typeSelect &&
    data.job_or_weapon_select
  ) {

    typeSelect.value =
      data.job_or_weapon_select
  }



  /* =========================
     4. skill select再生成
  ========================= */

  loadSkillSelect()



  /* =========================
   enemy type復元
========================= */

  const enemyTypeSelect =
    document.getElementById(
      "enemy_type_select"
    )

  if (
    enemyTypeSelect &&
    data.enemy_type_select
  ) {

    enemyTypeSelect.value =
      data.enemy_type_select
  }



  /* =========================
     enemy name再生成
  ========================= */

  loadEnemyNameSelect()



  /* =========================
     enemy name復元
  ========================= */

  const enemyNameSelect =
    document.getElementById(
      "enemy_name_select"
    )

  if (
    enemyNameSelect &&
    data.enemy_name_select
  ) {

    enemyNameSelect.value =
      data.enemy_name_select

    updateEnemyData()
  }



  /* =========================
     5. skill復元
  ========================= */

  const skillSelect =
    document.getElementById(
      "skill_select"
    )

  if (
    skillSelect &&
    data.skill_select
  ) {

    skillSelect.value =
      data.skill_select

    updateSkillData()
  }



  /* =========================
     6. その他復元
  ========================= */

  document
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach(el => {

      if (!el.id) return

      if (
        el.id === "job_or_weapon_select" ||
        el.id === "skill_select"
      ) {
        return
      }

      if (el.type === "radio") return

      if (el.type === "checkbox") {

        if (el.id in data) {
          el.checked = data[el.id]
        }

      } else {

        if (el.id in data) {
          el.value = data[el.id]
          el.dispatchEvent(new Event("change"))
        }
      }
    })



  /* =========================
     7. 更新
  ========================= */

  updateCallback()
  updateTableBuffHighlight()
}



/* ============================
   セーブ取得
============================ */

function getSaves() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || {}
}



/* ============================
   セーブ保存
============================ */

function setSaves(data) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  )
}



/* ============================
   セーブ
============================ */

export function saveCurrent() {

  const input =
    document.getElementById("save_name")

  const name = input.value.trim()

  if (!name) {
    alert("保存名を入力してください")
    return
  }

  const saves = getSaves()

  saves[name] = getFormData()

  setSaves(saves)

  refreshSaveList()

  alert(`「${name}」を保存しました`)
}



/* ============================
   ロード
============================ */

export async function loadCurrent() {

  const select =
    document.getElementById("save_list")

  const name = select.value

  if (!name) return

  const saves = getSaves()

  if (!saves[name]) return

  await setFormData(saves[name])
}



/* ============================
   削除
============================ */

export function deleteCurrent() {

  const select =
    document.getElementById("save_list")

  const name = select.value

  if (!name) return

  if (!confirm(`「${name}」を削除しますか？`)) {
    return
  }

  const saves = getSaves()

  delete saves[name]

  setSaves(saves)

  refreshSaveList()
}



/* ============================
   セーブ一覧更新
============================ */

export function refreshSaveList() {

  const select =
    document.getElementById("save_list")

  select.innerHTML = ""

  const saves = getSaves()

  Object.keys(saves).forEach(name => {

    const option =
      document.createElement("option")

    option.value = name
    option.textContent = name

    select.appendChild(option)
  })
}



/* ============================
   エクスポート
============================ */

export function exportCurrent() {

  const data =
    JSON.stringify(
      getFormData(),
      null,
      2
    )

  const blob = new Blob(
    [data],
    { type: "application/json" }
  )

  const url =
    URL.createObjectURL(blob)

  const a =
    document.createElement("a")

  const now = new Date()

  const timestamp =
    now
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")

  a.href = url

  a.download =
    `dqx-save-${timestamp}.json`

  a.click()

  URL.revokeObjectURL(url)
}



/* ============================
   インポート
============================ */

export function importCurrent() {

  document
    .getElementById("import_file")
    ?.click()
}

async function importFromFile(file) {

  if (!file) return

  try {

    const text =
      await file.text()

    const data =
      JSON.parse(text)

    await setFormData(data)

    alert("インポートしました")

  } catch {

    alert("JSONファイルの読込に失敗しました")
  }
}



/* ============================
   URL共有
============================ */

export async function copyShareURL() {

  const json =
    JSON.stringify(getFormData())

  const compressed =
    LZString
      .compressToEncodedURIComponent(
        json
      )

  const url =
    location.origin +
    location.pathname +
    "?d=" +
    compressed

  await navigator.clipboard.writeText(url)

  alert("共有URLをコピーしました")
}



/* ============================
   URLロード
============================ */

export async function loadFromURL() {

  const params =
    new URLSearchParams(location.search)

  const compressed =
    params.get("d")

  if (!compressed) return

  try {

    const json =
      LZString
        .decompressFromEncodedURIComponent(
          compressed
        )

    const data =
      JSON.parse(json)

    await setFormData(data)

  } catch (e) {

    console.error(e)

    alert("URL読込に失敗しました")
  }
}



/* ============================
   初期化
============================ */

let updateCallback = () => { }

export function initSaveManager(updateAllFn) {

  updateCallback = updateAllFn

  refreshSaveList()

  loadFromURL()

  document
    .getElementById("save_btn")
    ?.addEventListener("click", saveCurrent)

  document
    .getElementById("load_btn")
    ?.addEventListener("click", loadCurrent)

  document
    .getElementById("delete_btn")
    ?.addEventListener("click", deleteCurrent)

  document
    .getElementById("export_btn")
    ?.addEventListener("click", exportCurrent)

  document
    .getElementById("import_btn")
    ?.addEventListener("click", importCurrent)

  document
    .getElementById("share_btn")
    ?.addEventListener("click", copyShareURL)



  /* =========================
     jsonファイル読込
  ========================= */

  document
    .getElementById("import_file")
    ?.addEventListener(
      "change",
      e => {

        const file =
          e.target.files?.[0]

        importFromFile(file)

        // 同じファイルを連続選択可能にする
        e.target.value = ""
      }
    )
}