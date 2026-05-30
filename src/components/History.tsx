import { useState } from 'react';
import { useMilkEntries, useSettings } from '../hooks/useMilkEntries';
import { formatDisplayDate } from '../types';

export function History() {
  const { entries } = useMilkEntries();
  const { settings } = useSettings();

  // Get unique year-months that have data
  const monthGroups = entries.reduce((acc, entry) => {
    const monthKey = entry.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey,
        totalLiters: 0,
        entries: [],
      };
    }
    acc[monthKey].entries.push(entry);
    acc[monthKey].totalLiters += (entry.morning || 0) + (entry.afternoon || 0);
    return acc;
  }, {} as Record<string, { monthKey: string; totalLiters: number; entries: typeof entries }>);

  const sortedMonths = Object.values(monthGroups)
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));

  // Drill-down state
  const [drilldownMonth, setDrilldownMonth] = useState<string | null>(null);

  const selectedMonthData = drilldownMonth
    ? monthGroups[drilldownMonth]
    : null;

  const selectedMonthSummary = drilldownMonth && settings.milkPrice > 0
    ? { totalMoney: (selectedMonthData?.totalLiters || 0) * settings.milkPrice }
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Lịch sử</h2>

      {!drilldownMonth ? (
        <>
          {/* Month List View */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedMonths.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
            ) : (
              sortedMonths.map(({ monthKey, totalLiters }) => {
                const [year, month] = monthKey.split('-');
                const monthLabel = new Date(parseInt(year), parseInt(month) - 1, 1)
                  .toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
                const money = settings.milkPrice > 0
                  ? new Intl.NumberFormat('vi-VN').format(totalLiters * settings.milkPrice)
                  : null;

                return (
                  <button
                    key={monthKey}
                    onClick={() => setDrilldownMonth(monthKey)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-left"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{monthLabel}</div>
                      <div className="text-sm text-gray-500">
                        {monthGroups[monthKey].entries.length} ngày có dữ liệu
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{totalLiters.toFixed(1)} lít</div>
                      {money && <div className="text-sm text-gray-500">{money} VNĐ</div>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </>
      ) : (
        <>
          {/* Day List View for Selected Month */}
          <button
            onClick={() => setDrilldownMonth(null)}
            className="mb-4 text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            ← Quay lại
          </button>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white mb-4">
            <div className="text-sm opacity-90 mb-1">
              Tổng tháng {drilldownMonth}
            </div>
            <div className="text-3xl font-bold mb-2">
              {selectedMonthData?.totalLiters.toFixed(1)} lít
            </div>
            {selectedMonthSummary && (
              <div className="text-xl">
                = {new Intl.NumberFormat('vi-VN').format(selectedMonthSummary.totalMoney)} VNĐ
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedMonthData?.entries
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
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
              ))}
          </div>
        </>
      )}
    </div>
  );
}