import { calculate_status } from "../calc/statusCalc.js"
import { calculate_ratio } from "../calc/ratioCalc.js"

// 装備select生成
export async function loadEquipment() {

  const res = await fetch("data/equipment.json")
  const data = await res.json()

  const equipmentList = [
    "kubi",
    "yubi",
    "mune",
    "hoka",
    "monshou",
    "akasi",
    "kokoro1",
    "kokoro2"
  ]

  equipmentList.forEach(id => {
    createSelect(id, data[id])
  })
}

function createSelect(id, list) {

  const select = document.getElementById(id)
  const powerInput = document.getElementById(id + "_power")

  if (!select || !powerInput) return

  list.forEach(item => {
    const option = document.createElement("option")

    option.value = item.value ?? item.name
    option.textContent = item.name
    option.dataset.power = item.power

    select.appendChild(option)
  })

  select.addEventListener("change", () => {
    updateEquipment(select, powerInput)
  })

  if (select.options.length > 0) {
    updateEquipment(select, powerInput)
  }
}

function updateEquipment(select, powerInput) {
  const selected = select.options[select.selectedIndex]
  powerInput.value = selected?.dataset.power ?? 0

  calculate_status()
  calculate_ratio()
}