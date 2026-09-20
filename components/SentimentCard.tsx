
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SentimentData } from '../types';

interface Props {
  data: SentimentData;
}

const SentimentCard: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: Math.max(1, data.score > 0 ? data.score * 100 : 0) },
    { name: 'Negative', value: Math.max(1, data.score < 0 ? Math.abs(data.score) * 100 : 0) },
    { name: 'Neutral', value: Math.max(1, (1 - Math.abs(data.score)) * 100) }
  ].filter(d => d.value > 0);

  const COLORS = ['#10B981', '#EF4444', '#4B5563'];

  const getScoreColor = (score: number) => {
    if (score > 0.2) return 'text-emerald-400';
    if (score < -0.2) return 'text-red-400';
    return 'text-gray-400';
  };

  // Calculate bar styles for centered bidirectional gauge
  const barWidth = Math.min(Math.abs(data.score) * 50, 50); // Max 50% in either direction
  const barStyle = {
    width: `${barWidth}%`,
    left: data.score >= 0 ? '50%' : `${50 - barWidth}%`,
  };

  return (
    <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-700/50 shadow-2xl h-full flex flex-col">
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center lg:text-left">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-1">Detected Sentiment</h3>
          <div className={`text-5xl font-black tracking-tighter ${getScoreColor(data.score)}`}>
            {data.label}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
            {data.emotions.map((emo, i) => (
              <span key={i} className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold rounded-full border border-gray-700">
                #{emo.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800/50">
        <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          {/* Center Line Marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 z-10"></div>
          
          {/* Actual Sentiment Bar */}
          <div 
            className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out rounded-full ${data.score >= 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`} 
            style={barStyle}
          ></div>
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
          <span className={data.score < -0.2 ? 'text-red-500' : ''}>Negative</span>
          <span className={Math.abs(data.score) <= 0.2 ? 'text-gray-400' : ''}>Neutral</span>
          <span className={data.score > 0.2 ? 'text-emerald-500' : ''}>Positive</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
