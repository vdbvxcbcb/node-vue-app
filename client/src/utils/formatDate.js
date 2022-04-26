export function formatDate(value) {
  if (value === "") {
    //解决 value 为空传1970-01-01 00:00:00
    return ""
  } else {
    const d = new Date(value).toJSON()
    const date = new Date(+new Date(d) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, " ")
      .replace(/\.[\d]{3}Z/, "")
    return date
  }
};