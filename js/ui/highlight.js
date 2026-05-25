// 各種補正が適用されていれば色を変える
export function setupTableBuffHighlight(
  tableSelector
) {

  const tables =
    document.querySelectorAll(tableSelector)

  tables.forEach(table => {

    // select
    table.addEventListener(
      "change",
      () => updateTableBuffHighlight(
        tableSelector
      )
    )

    // input
    table.addEventListener(
      "input",
      () => updateTableBuffHighlight(
        tableSelector
      )
    )

  })

  updateTableBuffHighlight(tableSelector)
}



export function updateTableBuffHighlight(
  tableSelector = ".info-table"
) {

  const tables =
    document.querySelectorAll(tableSelector)

  tables.forEach(table => {

    const rows =
      table.querySelectorAll("tr")

    rows.forEach(row => {

      let active = false

      const select =
        row.querySelector("select")

      const checkbox =
        row.querySelector(
          "input[type='checkbox']"
        )

      const inputs =
        row.querySelectorAll(
          "input[type='number']"
        )



      /* ========================
         select
      ======================== */

      if (select) {

        if (select.value === "manual") {
          active = true
        }

        else if (
          !isNaN(parseFloat(select.value))
        ) {

          const val =
            parseFloat(select.value)

          if (val !== 0) {
            active = true
          }
        }

        else if (
          select.value !== "0" &&
          select.value !== ""
        ) {

          active = true
        }
      }



      /* ========================
         input
      ======================== */

      inputs.forEach(input => {

        if (!input.readOnly) {

          const val =
            parseFloat(input.value)

          if (
            !isNaN(val) &&
            val !== 0
          ) {

            active = true
          }
        }
      })



      /* ========================
         checkbox
      ======================== */

      if (
        checkbox &&
        checkbox.checked
      ) {

        active = true
      }



      row.classList.toggle(
        "active-buff",
        active
      )

    })
  })
}