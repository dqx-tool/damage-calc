// 汎用関数

// utility
export const val = id => Number(document.getElementById(id)?.value) || 0

// 配列マージ
export function mergeArray(obj, key, values) {

  obj[key] = [
    ...new Set([
      ...(obj[key] || []),
      ...values
    ])
  ]

}

// object マージ
export function mergeObject(obj, key, values) {

  obj[key] = {
    ...values,
    ...(obj[key] || {})
  }

}

// *_attr_P などと書くとそれらの id を要素とするリストを作成する関数
export function expandPattern(list, allIds) {
  if (!list) return []

  let result = []

  list.forEach(item => {
    if (item.includes("*")) {
      const suffix = item.replace("*", "")
      const matched = allIds.filter(id => id.endsWith(suffix))
      result.push(...matched)
    } else {
      result.push(item)
    }
  })

  return [...new Set(result)]
}

// 各ダメージアップ要素を合計
export function sumPercentValues(selector) {
  let total = 0

  document.querySelectorAll(selector).forEach(el => {
    const v = Number(el.value)
    if (!isNaN(v)) {
      total += Number(el.value || 0)
    }
  })
  return total
}

// v = x.0 なら x, v = x.5 なら x.5 を返す関数(浮動小数点の調整と小数点以下があれば表示する関数)
export function formatHalf(v) {
  const rounded = Math.round(v * 2) / 2  // ← 0.5刻みに丸める

  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1)
}