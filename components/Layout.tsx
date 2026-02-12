
import React from 'react';
import { Home, List, BookOpen, BarChart2, MessageSquare, Menu } from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'plan', label: 'Plano', icon: List },
    { id: 'reader', label: 'Leitor', icon: BookOpen },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'ai-coach', label: 'Mentor IA', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-gradient-to-br from-indigo-600 to-sky-500 text-white shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Lendo a Bíblia em 180 Dias</h1>
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
        <p className="text-indigo-100 text-sm opacity-90">Plano Semestral • Edição Especial</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-50">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
