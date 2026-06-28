import { val } from "../utils.js"

// ステータス計算
export function calculate_status() {

  const mp = val("mp")
  const kougekiR = val("kougekiR")
  const kougekiL = val("kougekiL")
  const shubi = val("shubi")
  const kouma = val("kouma")
  const kaima = val("kaima")
  const tikara = val("tikara")
  const kiyousa = val("kiyousa")
  const osharesa = val("osharesa")
  const tokugi_plus = val("tokugi_plus")
  const kaisin_plus = val("kaisin_plus")

  const nitou = 0.5 + val("nitou")
  const baiki = 1 + val("baiki")
  const gasin = val("gasin")
  const singun = val("singun")

  const weaponR = val("weaponR_power")
  const weaponL = val("weaponL_power")
  const kubi = val("kubi_power")
  const yubi = val("yubi_power")
  const mune = val("mune_power")
  const hoka = val("hoka_power")
  const monshou = val("monshou_power")
  const akasi = val("akasi_power")
  const kokoro1 = val("kokoro1_power")
  const kokoro2 = val("kokoro2_power")

  const accessory_total = [
    kubi, yubi, mune, hoka, monshou, akasi, kokoro1, kokoro2
  ].reduce((a, b) => a + b, 0)

  const singun_calculated =
    (150 + (Math.ceil(Math.max(0, (shubi - 800) / 100))) * 30) * singun

  const kougekiR_calculated =
    Math.floor(
      baiki * (tikara + weaponR + accessory_total)
      + kougekiR
      - tikara
      - (weaponR + accessory_total)
      + gasin
      + singun_calculated
    )

  const kougekiL_calculated =
    Math.floor(
      baiki * (tikara * nitou + weaponL + accessory_total)
      + kougekiL
      - tikara * nitou
      - (weaponL + accessory_total)
      + gasin
      + singun_calculated
    )

  const R = document.getElementById("kougekiR_calculated")
  if (R) R.value = kougekiR_calculated

  const L = document.getElementById("kougekiL_calculated")
  if (L) L.value = kougekiL_calculated

  const shubi_E = val("shubi_E")
  const rukani = val("rukani")

  const shubi_E_calculated = Math.floor(shubi_E * (1 + rukani))

  const enemy = document.getElementById("shubi_E_calculated")
  if (enemy) enemy.value = shubi_E_calculated

  return {
    mp,
    kougekiR_calculated,
    kougekiL_calculated,
    shubi_E_calculated,
    kougekiR,
    kougekiL,
    kouma,
    kaima,
    tikara,
    kiyousa,
    osharesa,
    tokugi_plus,
    kaisin_plus
  }
}