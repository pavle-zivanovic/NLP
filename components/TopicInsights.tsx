
import React from 'react';
import { TopicStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface Props {
  stats: TopicStats;
}

const TopicInsights: React.FC<Props> = ({ stats }) => {
const SENTIMENT_COLORS: Record<string, string> = {
    Positive: '#10B981', // Emerald green
    Neutral: '#64748B',  // Slate gray
    Negative: '#EF4444', // Crimson red
    Mixed: '#F59E0B'     // Amber yellow
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Sentiment Pulse */}
      <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-700/50 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Topic Sentiment Pulse</h4>
          <span className="text-[10px] text-gray-400 font-semibold">AFINN-165 Lexicon</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.sentimentPulse}>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(val: any) => [`${val}%`, 'Prevalence']}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {stats.sentimentPulse.map((entry) => (
                  <Cell key={`cell-${entry.label}`} fill={SENTIMENT_COLORS[entry.label] || '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-3 text-center">
           {stats.sentimentPulse.map(s => (
             <div key={s.label} className="flex flex-col">
               <span className="text-xs font-black text-white">{s.value}%</span>
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{s.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Top Entities */}
      <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-700/50">
        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Dominant Entities</h4>
        <div className="space-y-3">
          {stats.topEntities.map((entity, i) => (
            <div key={i} className="flex items-center justify-between group">
              <span className="text-sm font-bold text-gray-200">{entity.name}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md uppercase font-black">{entity.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity & Themes */}
      <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-700/50 flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Topic Intensity</h4>
          <div className="text-3xl font-black text-white">{stats.intensityScore}%</div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${stats.intensityScore}%` }}></div>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Key Themes</h4>
          <div className="flex flex-wrap gap-1">
            {stats.themes.map((theme, i) => (
              <span key={i} className="text-[9px] font-black bg-gray-800 text-gray-400 px-2 py-1 rounded-md">#{theme.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInsights;
