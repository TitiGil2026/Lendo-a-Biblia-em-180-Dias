
import React from 'react';
import { CheckCircle, ArrowRight, Flame, Trophy } from 'lucide-react';
import { DayPlan, UserStats } from '../types';

interface DashboardProps {
  currentDayPlan: DayPlan;
  stats: UserStats;
  onMarkComplete: (day: number) => void;
  onGoToReader: (reading: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentDayPlan, stats, onMarkComplete, onGoToReader }) => {
  const progressPercent = Math.round((stats.completedDays.length / 180) * 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Progresso Atual</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">{progressPercent}%</span>
              <span className="text-slate-400 text-sm">da Bíblia lida</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-orange-100">
              <Flame size={14} />
              {stats.streak} dias
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Today's Reading */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <BookOpen size={100} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          Leitura do Dia {currentDayPlan.day}
        </h3>
        
        <div className="space-y-3 mb-6">
          {currentDayPlan.readings.map((reading, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => onGoToReader(reading)}>
              <span className="font-semibold text-slate-700">
                {reading.book} {reading.startChapter}{reading.startChapter !== reading.endChapter ? `-${reading.endChapter}` : ''}
              </span>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          ))}
        </div>

        <button 
          onClick={() => onMarkComplete(currentDayPlan.day)}
          disabled={stats.completedDays.includes(currentDayPlan.day)}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-95 ${
            stats.completedDays.includes(currentDayPlan.day)
            ? 'bg-emerald-50 text-emerald-600 cursor-default'
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
          }`}
        >
          {stats.completedDays.includes(currentDayPlan.day) ? (
            <><CheckCircle size={20} /> Concluído hoje!</>
          ) : (
            'Marcar como Lido'
          )}
        </button>
      </div>

      {/* Verse of the Day */}
      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 italic text-indigo-900 shadow-sm">
        <p className="serif text-xl leading-relaxed mb-3">
          "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho."
        </p>
        <p className="text-right text-sm font-bold opacity-75">— Salmos 119:105</p>
      </div>

      {/* Quick Achievements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Capítulos</p>
            <p className="text-lg font-bold text-slate-700">{stats.totalChaptersRead}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="bg-sky-100 p-2 rounded-xl text-sky-600">
            <Flame size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Sequência</p>
            <p className="text-lg font-bold text-slate-700">{stats.streak} dias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { BookOpen } from 'lucide-react';

export default Dashboard;
