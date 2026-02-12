
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ReadingPlan from './components/ReadingPlan';
import AICoach from './components/AICoach';
import { generate180DayPlan } from './utils/readingPlanGenerator';
import { AppTab, UserStats, DayPlan } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('bible_stats_v1');
    return saved ? JSON.parse(saved) : {
      streak: 0,
      totalChaptersRead: 0,
      completedDays: [],
      lastReadDate: null,
      badges: []
    };
  });

  const fullPlan = useMemo(() => generate180DayPlan(), []);

  const currentDay = useMemo(() => {
    if (stats.completedDays.length === 0) return 1;
    const lastDay = Math.max(...stats.completedDays);
    return lastDay + 1 <= 180 ? lastDay + 1 : 180;
  }, [stats.completedDays]);

  const currentDayPlan = fullPlan[currentDay - 1];

  useEffect(() => {
    localStorage.setItem('bible_stats_v1', JSON.stringify(stats));
  }, [stats]);

  const handleMarkComplete = (day: number) => {
    if (stats.completedDays.includes(day)) return;

    const today = new Date().toDateString();
    let newStreak = stats.streak;
    
    if (stats.lastReadDate === null) {
      newStreak = 1;
    } else {
      const lastDate = new Date(stats.lastReadDate);
      const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const dayObj = fullPlan[day - 1];
    const chapsInDay = dayObj.readings.reduce((sum, r) => sum + (r.endChapter - r.startChapter + 1), 0);

    setStats(prev => ({
      ...prev,
      completedDays: [...prev.completedDays, day].sort((a, b) => a - b),
      totalChaptersRead: prev.totalChaptersRead + chapsInDay,
      streak: newStreak,
      lastReadDate: today
    }));
  };

  const currentReadingsText = currentDayPlan.readings
    .map(r => `${r.book} ${r.startChapter}-${r.endChapter}`)
    .join(', ');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            currentDayPlan={currentDayPlan} 
            stats={stats} 
            onMarkComplete={handleMarkComplete} 
            onGoToReader={(r) => setActiveTab('reader')}
          />
        );
      case 'plan':
        return (
          <ReadingPlan 
            plan={fullPlan} 
            completedDays={stats.completedDays} 
            onDayClick={(d) => {
              // Implementation could show details or set focus
            }}
          />
        );
      case 'reader':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
            <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 mb-4 animate-bounce">
              {/* Fixed SVG attributes to camelCase for React */}
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check"><path d="M8 3H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h16"/><path d="M16 12l2 2 4-4"/><path d="M22 6V5a2 2 0 0 0-2-2h-5"/><path d="M6 18h12"/><path d="M6 14h6"/><path d="M6 10h6"/><path d="M6 6h6"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Leitor Bíblico Integrado</h2>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Você está lendo: <br/>
              <span className="text-indigo-600 font-bold text-xl">{currentReadingsText}</span>
            </p>
            <p className="text-xs text-slate-400 bg-slate-100 px-4 py-2 rounded-lg">
              Integração com API externa em tempo real para texto completo (Almeida/NVI).
            </p>
            <button 
               onClick={() => handleMarkComplete(currentDay)}
               className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
            >
              Concluir Leitura
            </button>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Suas Estatísticas</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-sm font-bold uppercase mb-1">Total de Capítulos</p>
                <p className="text-4xl font-black text-indigo-600">{stats.totalChaptersRead}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{width: `${(stats.totalChaptersRead/1189)*100}%`}}></div>
                  </div>
                  <span>{Math.round((stats.totalChaptersRead/1189)*100)}%</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm font-bold uppercase mb-1">Dias Concluídos</p>
                  <p className="text-3xl font-black text-emerald-600">{stats.completedDays.length} / 180</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500">
                  {/* Fixed SVG attributes to camelCase for React */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-2"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 20l2 2 4-4"/></svg>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-sm font-bold uppercase mb-4">Conquistas</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {[
                    { icon: '🌱', label: 'Iniciante', unlocked: stats.completedDays.length >= 1 },
                    { icon: '🔥', label: '7 Dias', unlocked: stats.streak >= 7 },
                    { icon: '📖', label: 'Gênesis', unlocked: stats.completedDays.length >= 10 },
                    { icon: '🕊️', label: 'Constante', unlocked: stats.streak >= 14 },
                    { icon: '🏆', label: '6 Meses', unlocked: stats.completedDays.length >= 180 },
                  ].map((badge, idx) => (
                    <div key={idx} className={`flex-shrink-0 flex flex-col items-center gap-1 ${badge.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                      <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-3xl">
                        {badge.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 text-center">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai-coach':
        return <AICoach currentReadings={currentReadingsText} />;
      default:
        return <div>Em breve...</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
