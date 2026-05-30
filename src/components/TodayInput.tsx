import { useState, useEffect } from 'react';
import { useMilkEntries } from '../hooks/useMilkEntries';
import { formatDate, type MilkEntry } from '../types';

interface TodayInputProps {
  onRefresh: () => void;
}

export function TodayInput({ onRefresh }: TodayInputProps) {
  const { entries, updateEntry } = useMilkEntries();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [displayEntry, setDisplayEntry] = useState<MilkEntry | null>(null);

  // Update displayEntry when date or entries change
  useEffect(() => {
    const existing = entries.find((e) => e.date === selectedDate);
    setDisplayEntry(existing || { date: selectedDate, morning: null, afternoon: null });
  }, [selectedDate, entries]);

  const handleSubmit = (field: 'morning' | 'afternoon') => {
    const input = document.getElementById(field) as HTMLInputElement;
    const value = parseFloat(input.value);

    if (!isNaN(value) && value > 0) {
      updateEntry(selectedDate, field, value);
      input.value = '';
      onRefresh();
    }
  };

  const entry = displayEntry || { date: selectedDate, morning: null, afternoon: null };
  const displayDate = new Date(selectedDate + 'T00:00:00');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Chọn ngày</label>
        <input
          type="date"
          value={selectedDate}
          max={formatDate(today)}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full text-lg p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
        />
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
              placeholder={entry.morning ? entry.morning.toString() : '0.0'}
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
              Đã nhập: {entry.morning} lít
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
              placeholder={entry.afternoon ? entry.afternoon.toString() : '0.0'}
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
              Đã nhập: {entry.afternoon} lít
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
  );
}