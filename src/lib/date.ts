export function getMonthRange(referenceDate: Date = new Date()): { start: Date; end: Date; daysInMonth: number } {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end, daysInMonth: end.getDate() };
}

// Local-calendar-date ISO string (YYYY-MM-DD) — deliberately not
// `toISOString()`, which converts to UTC and can shift the date near
// midnight depending on the device's timezone.
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
