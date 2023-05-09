/**
 * Get current date
 */
export function date() {
  const d = new Date();
  
  let h = d.getHours();
  let m = d.getMinutes();

  return (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m);
}
