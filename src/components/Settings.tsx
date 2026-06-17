import { useSettings } from '../hooks/useMilkEntries';

export function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleChange = (rawValue: string) => {
    if (rawValue === '' || !isNaN(parseFloat(rawValue))) {
      updateSettings({ ...settings, milkPrice: rawValue === '' ? 0 : parseFloat(rawValue) });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Cài đặt</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            💰 Giá sữa (VNĐ / lít)
          </label>
          <div className="flex gap-2 items-stretch">
            <input
              type="number"
              defaultValue={settings.milkPrice || ''}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 min-w-0 text-xl font-bold p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              placeholder="0"
              min="0"
              step="100"
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Giá sữa dùng để tính tiền cuối tháng — nhập là tự động lưu
          </p>
        </div>

        {settings.milkPrice > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-700">
              ✓ Đang áp dụng: <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(settings.milkPrice)}</span> VNĐ / lít
            </p>
          </div>
        )}
      </div>
    </div>
  );
}