
import React, { useState } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { getSpiritualAdvice } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AICoach: React.FC<{ currentReadings: string }> = ({ currentReadings }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou seu mentor espiritual de IA. Como posso ajudar com sua caminhada bíblica hoje? Posso explicar passagens difíceis ou oferecer encorajamento.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await getSpiritualAdvice(userMsg, currentReadings);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 mb-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-indigo-900">Mentor Espiritual</h2>
          <p className="text-[10px] text-indigo-700 uppercase tracking-tighter">Alimentado por Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {m.role === 'assistant' && <Bot size={18} className="shrink-0 mt-1 text-indigo-500" />}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
              {m.role === 'user' && <User size={18} className="shrink-0 mt-1" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte algo sobre a Bíblia..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default AICoach;
