
import React from 'react';
import { Relation } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface Props {
  relations: Relation[];
}

const EntityAnalytics: React.FC<Props> = ({ relations }) => {
  const entityCounts: Record<string, { subject: number; object: number }> = {};

  relations.forEach(rel => {
    const sub = rel.subject.toLowerCase();
    const obj = rel.object.toLowerCase();
    
    if (!entityCounts[sub]) entityCounts[sub] = { subject: 0, object: 0 };
    if (!entityCounts[obj]) entityCounts[obj] = { subject: 0, object: 0 };
    
    entityCounts[sub].subject++;
    entityCounts[obj].object++;
  });

  const data = Object.entries(entityCounts)
    .map(([name, counts]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      Subject: counts.subject,
      Object: counts.object,
      Total: counts.subject + counts.object
    }))
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 5);

  return (
    <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-700/50">
      <h3 className="text-xl font-black text-blue-400 mb-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6" />
        Entity Dynamics (Actor vs Target)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={100} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
            />
            <Bar dataKey="Subject" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="Object" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase">Actor (Subject)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase">Target (Object)</span>
        </div>
      </div>
    </div>
  );
};

export default EntityAnalytics;
