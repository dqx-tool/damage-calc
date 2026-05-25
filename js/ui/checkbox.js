// checkbox ⇄ select 連動
export function setupCheckbox() {

  document.querySelectorAll("input[type=checkbox][data-target]").forEach(cb => {

    const sel = document.getElementById(cb.dataset.target)
    if (!sel || sel.tagName !== "SELECT") return

    // checkbox → select
    cb.addEventListener("change", () => {

      sel.selectedIndex =
        cb.checked
          ? sel.options.length - 1
          : 0

      sel.dispatchEvent(new Event("change"))

    })

    // select → checkbox
    sel.addEventListener("change", () => {

      const maxIndex = (sel.options?.length ?? 1) - 1
      const newState = sel.selectedIndex === maxIndex

      if (cb.checked !== newState) {

        cb.checked = newState

        // ← 追加
        cb.dispatchEvent(
          new Event("change", { bubbles: true })
        )
      }

    })

    // 初期状態
    sel.selectedIndex =
      cb.checked
        ? sel.options.length - 1
        : 0
  })
}