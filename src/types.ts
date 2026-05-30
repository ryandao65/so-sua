export interface MilkEntry {
  date: string; // YYYY-MM-DD
  morning: number | null; // liters
  afternoon: number | null; // liters
}

export interface AppSettings {
  milkPrice: number; // price per liter
}

export interface MonthSummary {
  month: string; // YYYY-MM
  totalLiters: number;
  totalMoney: number;
  entries: MilkEntry[];
}

export const STORAGE_KEYS = {
  ENTRIES: 'so-sua_entries',
  SETTINGS: 'so-sua_settings',
} as const;

export function getDefaultSettings(): AppSettings {
  return { milkPrice: 0 };
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  });
}

export function getMonthKey(dateStr: string): string {
  return dateStr.substring(0, 7); // YYYY-MM
}

export function getYearKey(dateStr: string): string {
  return dateStr.substring(0, 4); // YYYY
}