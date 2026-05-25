// はやぶさの剣二刀流の左手、8回判定(イオマータなど)のときの表示を切り替える
export function updateResultLayout(skill) {

  const col7 = document.getElementById("col7")
  const colL = document.getElementById("colL")

  const hits = skill.ratio ?? Array(skill.times ?? 1).fill(1)

  if (!skill) return

  const leftHand = document.getElementById("left_hand").checked

  // ツメ・はやぶさなど
  if (skill.name === "ツメ、はやぶさの剣、聖王のナイフ etc.") {
    col7.textContent = "左手1"
    colL.textContent = "左手2"
  }

  // イオマータなど
  else if (hits.length === 8) {
    col7.textContent = "7"
    colL.textContent = "8"
  }

  else {
    col7.textContent = "7"
    colL.textContent = "左手"
  }

}