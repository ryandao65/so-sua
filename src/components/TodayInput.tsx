import { useState, useMemo, useRef, useEffect } from 'react';
import { useMilkEntries } from '../hooks/useMilkEntries';
import { useSettings } from '../hooks/useMilkEntries';
import { getDaysInMonth, formatMonthLabel } from '../types';

export function TodayInput() {
  const { entries, updateEntry } = useMilkEntries();
  const { settings } = useSettings();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentMonth, setCurrentMonth] = useState(() => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [year, month] = currentMonth.split('-').map(Number);
  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(currentMonth)),
    [entries, currentMonth],
  );

  const totalLiters = useMemo(
    () => monthEntries.reduce((sum, e) => sum + (e.morning || 0) + (e.afternoon || 0), 0),
    [monthEntries],
  );

  const totalMoney = totalLiters * settings.milkPrice;

  const getEntryForDay = (day: number) => {
    const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
    return entries.find((e) => e.date === dateStr);
  };

  const handleInputChange = (day: number, field: 'morning' | 'afternoon', rawValue: string) => {
    if (rawValue === '' || !isNaN(parseFloat(rawValue))) {
      const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
      updateEntry(dateStr, field, rawValue === '' ? null : parseFloat(rawValue));
    }
  };

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const canGoNext = currentMonth < currentMonthKey;
  const isCurrentMonth = currentMonth === currentMonthKey;

  const goToPrevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const goToNextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const goToCurrentMonth = () => setCurrentMonth(currentMonthKey);

  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const todayRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (todayRowRef.current) {
      todayRowRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [currentMonth]);

  return (
    <div className="space-y-4 mb-24">
      {/* Month Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg transition"
          >
            ◀
          </button>
          <h2 className="text-lg font-bold text-gray-800 text-center flex-1 mx-2">
            {formatMonthLabel(currentMonth)}
          </h2>
          <button
            onClick={goToNextMonth}
            disabled={!canGoNext}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg transition ${
              canGoNext
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            ▶
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={goToCurrentMonth}
            className="w-full mt-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl transition text-sm"
          >
            Quay về tháng này
          </button>
        )}
      </div>

      {/* Totals Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-5 text-white">
        <div className="text-sm opacity-90 mb-1">Tổng tháng</div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{totalLiters.toFixed(1)}</span>
          <span className="text-lg opacity-90">lít</span>
          {settings.milkPrice > 0 && (
            <>
              <span className="text-lg opacity-70 mx-1">·</span>
              <span className="text-xl font-semibold">
                {new Intl.NumberFormat('vi-VN').format(totalMoney)} VNĐ
              </span>
            </>
          )}
        </div>
        {settings.milkPrice === 0 && (
          <div className="text-sm opacity-80 italic mt-1">
            (Cài đặt giá sữa trong tab ⚙️ để xem thành tiền)
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-16">Ngày</th>
                <th className="py-3 px-2 text-center text-sm font-semibold text-amber-700 w-1/2">
                  🌅 Sáng (lít)
                </th>
                <th className="py-3 px-2 text-center text-sm font-semibold text-orange-700 w-1/2">
                  🌇 Chiều (lít)
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
                const entry = getEntryForDay(day);
                const isToday = dateStr === todayStr;
                const dayOfWeek = new Date(year, month - 1, day).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <tr
                    key={day}
                    ref={isToday ? todayRowRef : undefined}
                    className={`border-b border-gray-100 transition ${
                      isToday
                        ? 'bg-blue-100 border-l-4 border-l-blue-500 shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-2.5 px-4 align-middle">
                      {isToday ? (
                        <div className="flex flex-col items-center">
                          <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {day}
                          </span>
                          <span className="text-[10px] text-blue-500 font-medium mt-0.5">
                            Hôm nay
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className={`font-semibold leading-tight ${
                            isWeekend ? 'text-red-500' : 'text-gray-700'
                          }`}>
                            {day}
                          </div>
                          <div className="text-xs text-gray-400 leading-tight mt-0.5">
                            {dayLabels[dayOfWeek]}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        key={`${currentMonth}-${day}-${dateStr}-morning`}
                        type="number"
                        step="0.1"
                        min="0"
                        defaultValue={entry?.morning ?? ''}
                        placeholder="-"
                        onChange={(e) => handleInputChange(day, 'morning', e.target.value)}
                        className={`w-full text-center text-base font-semibold py-2 px-1 rounded-xl border-2 focus:outline-none transition ${
                          isToday
                            ? 'border-amber-400 bg-amber-100 focus:border-amber-600'
                            : 'border-amber-200 bg-amber-50/50 focus:border-amber-500'
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        key={`${currentMonth}-${day}-${dateStr}-afternoon`}
                        type="number"
                        step="0.1"
                        min="0"
                        defaultValue={entry?.afternoon ?? ''}
                        placeholder="-"
                        onChange={(e) => handleInputChange(day, 'afternoon', e.target.value)}
                        className={`w-full text-center text-base font-semibold py-2 px-1 rounded-xl border-2 focus:outline-none transition ${
                          isToday
                            ? 'border-orange-400 bg-orange-100 focus:border-orange-600'
                            : 'border-orange-200 bg-orange-50/50 focus:border-orange-500'
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
