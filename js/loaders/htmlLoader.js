export async function loadHTML(file, id) {
  const res = await fetch(file)
  const html = await res.text()
  document.getElementById(id).innerHTML = html
}