
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'stage1', label: '1차 평가', icon: 'fa-1' },
    { id: 'stage2', label: '2차 평가', icon: 'fa-2' },
    { id: 'stage3', label: '3차 평가', icon: 'fa-3' },
    { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-800">EReSA 평가 플랫폼</h1>
        </div>
        <nav className="flex gap-1 h-full items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 h-full flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-medium bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-sm`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="no-print border-t border-slate-200 py-6 px-8 text-center text-slate-400 text-sm bg-white">
        © 2024 EReSA Certification System. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
