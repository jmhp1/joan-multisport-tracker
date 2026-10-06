// Formats a Date as a local-calendar 'YYYY-MM-DD' string. Deliberately avoids
// toISOString(), which converts to UTC and shifts the date in any timezone ahead of UTC.
export function toLocalISODate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
