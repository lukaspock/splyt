export const formatCentsAsInputValue = (cents: number): string => (cents / 100).toFixed(2);

export const formatCentsAsDisplay = (cents: number): string =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export const parseEuroInputToCents = (value: string): number => {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};
