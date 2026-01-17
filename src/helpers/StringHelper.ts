export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}


export const safeDecodeURIComponent = (str: string) => {
  try {
    if (!str || str.trim().length === 0) return "";
    if (str.includes(' ')) return str;

    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    return str;
  }
};

export function formatShortTime(input: string): string {
  let date = new Date(input.replace(" ", "T"));
  if (isNaN(date.getTime())) return "";
  let now = new Date();

  let sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    let hh = String(date.getHours()).padStart(2, "0");
    let mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } else {
    let d = String(date.getDate()).padStart(2, "0");
    let m = String(date.getMonth() + 1).padStart(2, "0");
    let y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
}
