import { useState, useEffect, useCallback } from 'react';
import {
  type MilkEntry,
  type AppSettings,
  type MonthSummary,
  STORAGE_KEYS,
  getDefaultSettings,
  getMonthKey,
  formatDate,
} from '../types';

export function useMilkEntries() {
  const [entries, setEntries] = useState<MilkEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = useCallback((newEntries: MilkEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
  }, []);

  const getTodayEntry = useCallback((): MilkEntry => {
    const today = formatDate(new Date());
    const existing = entries.find((e) => e.date === today);
    return existing || { date: today, morning: null, afternoon: null };
  }, [entries]);

  const updateEntry = useCallback(
    (date: string, field: 'morning' | 'afternoon', value: number | null) => {
      const existingIndex = entries.findIndex((e) => e.date === date);
      let newEntries: MilkEntry[];

      if (existingIndex >= 0) {
        newEntries = [...entries];
        newEntries[existingIndex] = {
          ...newEntries[existingIndex],
          [field]: value,
        };
      } else {
        const newEntry: MilkEntry = {
          date,
          morning: field === 'morning' ? value : null,
          afternoon: field === 'afternoon' ? value : null,
        };
        newEntries = [...entries, newEntry];
      }

      saveEntries(newEntries);
    },
    [entries, saveEntries]
  );

  const getEntriesForMonth = useCallback(
    (monthKey: string): MilkEntry[] => {
      return entries
        .filter((e) => getMonthKey(e.date) === monthKey)
        .sort((a, b) => a.date.localeCompare(b.date));
    },
    [entries]
  );

  const getMonthSummary = useCallback(
    (monthKey: string, pricePerLiter: number): MonthSummary => {
      const monthEntries = getEntriesForMonth(monthKey);
      const totalLiters = monthEntries.reduce(
        (sum, e) =>
          sum + (e.morning || 0) + (e.afternoon || 0),
        0
      );

      return {
        month: monthKey,
        totalLiters,
        totalMoney: totalLiters * pricePerLiter,
        entries: monthEntries,
      };
    },
    [getEntriesForMonth]
  );

  return {
    entries,
    getTodayEntry,
    updateEntry,
    getEntriesForMonth,
    getMonthSummary,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  }, []);

  return { settings, updateSettings };
}