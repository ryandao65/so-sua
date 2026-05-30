import { useState } from 'react';
import { useMilkEntries } from '../hooks/useMilkEntries';
import { useSettings } from '../hooks/useMilkEntries';
import { formatDisplayDate } from '../types';

export function History() {
  const { entries, getMonthSummary } = useMilkEntries();
  const { settings } = useSettings();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return String(now.getMonth() + 1).padStart(2, '0');
  });
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return { value: month, label: new Date(2024, i, 1).toLocaleDateString('vi-VN', { month: 'long' }) };
  });

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const monthKey = `${selectedYear}-${selectedMonth}`;
  const summary = getMonthSummary(monthKey, settings.milkPrice || 0);

  // Year view data
  const yearEntries = entries.filter((e) => e.date.startsWith(selectedYear));
  const yearTotalLiters = yearEntries.reduce(
    (sum, e) => sum + (e.morning || 0) + (e.afternoon || 0),
    0
  );
  const yearTotalMoney = yearTotalLiters * settings.milkPrice;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Lịch sử</h2>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('month')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'month'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Theo Tháng
        </button>
        <button
          onClick={() => setViewMode('year')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'year'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Theo Năm
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {viewMode === 'month' ? (
          <>
            <select
              value={selectedMonth.split('-')[1]}
              onChange={(e) =>
                setSelectedMonth(`${selectedYear}-${e.target.value}`)
              }
              className="px-3 py-2 border rounded-lg"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </>
        ) : (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white mb-4">
        <div className="text-sm opacity-90 mb-1">
          {viewMode === 'month'
            ? `Tổng tháng ${selectedMonth}`
            : `Tổng năm ${selectedYear}`}
        </div>
        <div className="text-3xl font-bold mb-2">
          {viewMode === 'month' ? summary.totalLiters.toFixed(1) : yearTotalLiters.toFixed(1)} lít
        </div>
        {settings.milkPrice > 0 && (
          <div className="text-xl">
            = {new Intl.NumberFormat('vi-VN').format(
              viewMode === 'month' ? summary.totalMoney : yearTotalMoney
            )} VNĐ
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {viewMode === 'month' ? (
          summary.entries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu tháng này</p>
          ) : (
            summary.entries.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{formatDisplayDate(entry.date)}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-amber-600">
                    ☀️ {entry.morning ?? '-'} lít
                  </span>
                  <span className="text-orange-600">
                    🌇 {entry.afternoon ?? '-'} lít
                  </span>
                  <span className="font-bold text-blue-600">
                    = {((entry.morning || 0) + (entry.afternoon || 0)).toFixed(1)} lít
                  </span>
                </div>
              </div>
            ))
          )
        ) : (
          yearEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu năm này</p>
          ) : (
            yearEntries
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{formatDisplayDate(entry.date)}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-amber-600">
                      ☀️ {entry.morning ?? '-'} lít
                    </span>
                    <span className="text-orange-600">
                      🌇 {entry.afternoon ?? '-'} lít
                    </span>
                    <span className="font-bold text-blue-600">
                      = {(entry.morning || 0) + (entry.afternoon || 0)} lít
                    </span>
                  </div>
                </div>
              ))
          )
        )}
      </div>
    </div>
  );
}