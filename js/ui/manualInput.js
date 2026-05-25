// 敵の属性耐性が手動入力のときの関数
export function setupManualInput() {

  const select = document.getElementById("taisei_attr_E")
  const container = document.getElementById("taisei_enemy_input_attr")

  if (!select || !container) return

  select.addEventListener("change", () => {

    container.innerHTML = ""

    if (select.value === "manual") {

      const wrapper = document.createElement("div")
      wrapper.classList.add("percent-input")

      const input = document.createElement("input")
      input.type = "number"

      wrapper.appendChild(input)
      container.appendChild(wrapper)

      input.focus()
    }
  })
}