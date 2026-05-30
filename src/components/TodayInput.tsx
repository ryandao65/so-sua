import { useState, useEffect } from 'react';
import { useMilkEntries } from '../hooks/useMilkEntries';
import { formatDate, type MilkEntry } from '../types';

export function TodayInput({ onRefresh }: { onRefresh: () => void }) {
  const { entries, updateEntry, deleteEntry } = useMilkEntries();
  const today = new Date();
  const todayStr = formatDate(today);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [displayEntry, setDisplayEntry] = useState<MilkEntry | null>(null);

  useEffect(() => {
    const existing = entries.find((e) => e.date === selectedDate);
    setDisplayEntry(existing || { date: selectedDate, morning: null, afternoon: null });
  }, [selectedDate, entries]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    handleDateChange(todayStr);
  };

  const handleSubmit = (field: 'morning' | 'afternoon') => {
    const input = document.getElementById(field) as HTMLInputElement;
    const value = parseFloat(input.value);

    if (!isNaN(value) && value > 0) {
      updateEntry(selectedDate, field, value);
      input.value = '';
      onRefresh();
    }
  };

  const handleDelete = (date: string) => {
    if (confirm('Xóa dữ liệu ngày này?')) {
      deleteEntry(date);
      if (selectedDate === date) {
        const nextDate = todayStr;
        setSelectedDate(nextDate);
      }
      onRefresh();
    }
  };

  const jumpToDate = (date: string) => {
    setSelectedDate(date);
  };

  const entry = displayEntry || { date: selectedDate, morning: null, afternoon: null };
  const displayDate = new Date(selectedDate + 'T00:00:00');

  // Recent entries (excluding today if there are others)
  const recentEntries = entries
    .filter((e) => e.date !== todayStr)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Main Input Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-2 items-center mb-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Chọn ngày</label>
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full text-lg p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          {selectedDate !== todayStr && (
            <button
              onClick={goToToday}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl transition text-sm"
            >
              Hôm nay
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📅 {displayDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sáng */}
          <div className="bg-amber-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🌅</span>
              <h3 className="text-lg font-semibold text-amber-800">Buổi Sáng</h3>
            </div>
            <div className="flex gap-2 items-stretch">
              <input
                id="morning"
                type="number"
                step="0.1"
                min="0"
                placeholder={entry.morning ? entry.morning.toFixed(1) : '0.0'}
                defaultValue={entry.morning ?? ''}
                className="flex-1 min-w-0 text-xl sm:text-2xl font-bold text-center p-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={() => handleSubmit('morning')}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition whitespace-nowrap"
              >
                Lưu
              </button>
            </div>
            {entry.morning !== null && (
              <p className="text-center mt-2 text-amber-700 font-medium">
                Đã nhập: {entry.morning.toFixed(1)} lít
              </p>
            )}
          </div>

          {/* Chiều */}
          <div className="bg-orange-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🌇</span>
              <h3 className="text-lg font-semibold text-orange-800">Buổi Chiều</h3>
            </div>
            <div className="flex gap-2 items-stretch">
              <input
                id="afternoon"
                type="number"
                step="0.1"
                min="0"
                placeholder={entry.afternoon ? entry.afternoon.toFixed(1) : '0.0'}
                defaultValue={entry.afternoon ?? ''}
                className="flex-1 min-w-0 text-xl sm:text-2xl font-bold text-center p-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none"
              />
              <button
                onClick={() => handleSubmit('afternoon')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition whitespace-nowrap"
              >
                Lưu
              </button>
            </div>
            {entry.afternoon !== null && (
              <p className="text-center mt-2 text-orange-700 font-medium">
                Đã nhập: {entry.afternoon.toFixed(1)} lít
              </p>
            )}
          </div>
        </div>

        {/* Tổng */}
        {(entry.morning !== null || entry.afternoon !== null) && (
          <div className="mt-4 p-4 bg-gray-100 rounded-xl text-center">
            <span className="text-gray-600">Tổng: </span>
            <span className="text-2xl font-bold text-gray-800">
              {((entry.morning || 0) + (entry.afternoon || 0)).toFixed(1)} lít
            </span>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Ngày đã nhập</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentEntries.map((e) => {
              const date = new Date(e.date + 'T00:00:00');
              const dateStr = date.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: 'numeric',
                month: 'numeric',
              });
              const total = (e.morning || 0) + (e.afternoon || 0);
              const isSelected = e.date === selectedDate;

              return (
                <div
                  key={e.date}
                  className={`flex items-center justify-between p-3 rounded-xl transition ${
                    isSelected
                      ? 'bg-blue-100 border-2 border-blue-400'
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => !isSelected && jumpToDate(e.date)}
                >
                  <div>
                    <span className="font-medium text-gray-800">{dateStr}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ☀️ {e.morning ?? '-'} | 🌇 {e.afternoon ?? '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">{total.toFixed(1)} lít</span>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleDelete(e.date);
                      }}
                      className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}