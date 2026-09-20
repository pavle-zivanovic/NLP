
import React from 'react';
import { Relation } from '../types';
import { Network, ArrowDown, Info } from 'lucide-react';

interface Props {
  relations: Relation[];
}

const RelationshipGraph: React.FC<Props> = ({ relations }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-indigo-400 flex items-center gap-3">
        <Network className="w-6 h-6" />
        Semantic SVO Triples (Subject - Verb - Object)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relations.map((rel, idx) => (
          <div key={idx} className="bg-gray-900/40 p-6 rounded-[2rem] border border-gray-700/50 hover:border-indigo-500/50 transition-all hover:bg-gray-900/60 group shadow-lg">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col gap-3">
                {/* Subject */}
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-black uppercase shrink-0">Sub</div>
                   <span className="text-lg font-black text-white bg-blue-900/20 px-4 py-1.5 rounded-xl border border-blue-500/20 truncate">
                    {rel.subject}
                   </span>
                </div>

                {/* Arrow & Action */}
                <div className="pl-4 flex items-center gap-4 py-1">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <ArrowDown className="w-3 h-3 text-indigo-400 -ml-1.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{rel.action}</span>
                    <span className="text-[10px] text-gray-500 font-medium">Predicate Action</span>
                  </div>
                </div>

                {/* Object */}
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 text-[10px] font-black uppercase shrink-0">Obj</div>
                   <span className="text-lg font-black text-white bg-purple-900/20 px-4 py-1.5 rounded-xl border border-purple-500/20 truncate">
                    {rel.object}
                   </span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-800">
                <p className="text-xs text-gray-400 leading-relaxed font-medium flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-indigo-400 mr-1">Rationale:</strong>
                    {rel.explanation}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelationshipGraph;

