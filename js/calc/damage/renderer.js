export function renderDamage(result) {

  result.right.forEach((d, i) => {

    const ids = ["n", "m", "M"]

    ids.forEach((id, j) => {

      const el = document.getElementById(`${id}${i + 1}`)

      if (el) el.textContent = d[j]
    })
  })

  result.left.forEach((d, i) => {

    const ids = ["nL", "mL", "ML"]

    ids.forEach((id, j) => {

      const el = document.getElementById(`${id}${i + 1}`)

      if (el) el.textContent = d[j]
    })
  })

  document.getElementById("nt").textContent = result.total.n
  document.getElementById("mt").textContent = result.total.m
  document.getElementById("Mt").textContent = result.total.M
}