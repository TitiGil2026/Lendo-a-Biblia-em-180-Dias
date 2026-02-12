
import React, { useState } from 'react';
import { DayPlan } from '../types';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface ReadingPlanProps {
  plan: DayPlan[];
  completedDays: number[];
  onDayClick: (day: number) => void;
}

const ReadingPlan: React.FC<ReadingPlanProps> = ({ plan, completedDays, onDayClick }) => {
  const [expandedMonth, setExpandedMonth] = useState<number>(0);
  
  // Group plan into months (30 days each)
  const months = [];
  for (let i = 0; i < 6; i++) {
    months.push(plan.slice(i * 30, (i + 1) * 30));
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Cronograma Completo</h2>
      
      {months.map((monthDays, monthIdx) => {
        const isOpen = expandedMonth === monthIdx;
        const monthCompleted = monthDays.every(d => completedDays.includes(d.day));
        const monthProgress = monthDays.filter(d => completedDays.includes(d.day)).length;

        return (
          <div key={monthIdx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button 
              onClick={() => setExpandedMonth(isOpen ? -1 : monthIdx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div>
                <h3 className="font-bold text-slate-800">Mês {monthIdx + 1}</h3>
                <p className="text-xs text-slate-500">{monthProgress} de 30 dias concluídos</p>
              </div>
              <div className="flex items-center gap-3">
                {monthCompleted && <CheckCircle2 className="text-emerald-500" size={20} />}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {isOpen && (
              <div className="px-2 pb-4 grid grid-cols-5 gap-2 border-t border-slate-50 p-4">
                {monthDays.map((day) => {
                  const isDone = completedDays.includes(day.day);
                  return (
                    <button
                      key={day.day}
                      onClick={() => onDayClick(day.day)}
                      className={`h-12 w-full rounded-xl flex items-center justify-center text-sm font-bold transition-all border ${
                        isDone 
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReadingPlan;
