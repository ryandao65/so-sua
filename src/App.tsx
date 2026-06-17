import { useState } from 'react';
import { TodayInput } from './components/TodayInput';
import { History } from './components/History';
import { Settings } from './components/Settings';

type Tab = 'today' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Content */}
      <main className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-lg">
        {activeTab === 'today' && <TodayInput />}
        {activeTab === 'history' && <History />}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center py-2 px-6 rounded-lg transition ${
              activeTab === 'today' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-xs font-medium">Nhập liệu</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-2 px-6 rounded-lg transition ${
              activeTab === 'history' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-xs font-medium">Lịch sử</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-2 px-6 rounded-lg transition ${
              activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-xs font-medium">Cài đặt</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;