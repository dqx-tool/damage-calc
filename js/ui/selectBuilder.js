// type select
export function buildTypeSelect(data, selectId, onChange) {

  const select = document.getElementById(selectId)

  select.innerHTML = ""

  Object.keys(data).forEach(key => {

    const option = document.createElement("option")

    option.value = key
    option.textContent = key

    select.appendChild(option)

  })

  select.onchange = onChange
}


// name select
export function buildNameSelect(data, typeId, nameId, onChange) {

  const type =
    document.getElementById(typeId).value

  const select =
    document.getElementById(nameId)

  select.innerHTML = ""

  data[type].forEach(item => {

    const option = document.createElement("option")

    option.value = item.name
    option.textContent = item.name

    select.appendChild(option)

  })

  select.onchange = onChange
}