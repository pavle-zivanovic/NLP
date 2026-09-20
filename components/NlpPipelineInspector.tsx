import React from 'react';
import { NlpDiagnostics } from '../types';
import { Layers, CheckCircle, Tag, BookOpen, Cpu } from 'lucide-react';

interface Props {
  diagnostics: NlpDiagnostics;
}

const NlpPipelineInspector: React.FC<Props> = ({ diagnostics }) => {
  return (
    <div className="bg-gray-900/60 p-8 lg:p-10 rounded-[2.5rem] border border-gray-700/50 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              Open-Source NLP Pipeline
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                Active
              </span>
            </h3>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Real-time statistical & grammatical parsing without cloud LLMs (zero API keys required)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700 text-xs text-gray-300 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Compromise v14 + AFINN-165</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-700/40">
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Token Count</div>
          <div className="text-2xl font-black text-white mt-1">{diagnostics.tokensCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Lemmatized tokens</div>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-700/40">
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sentences</div>
          <div className="text-2xl font-black text-white mt-1">{diagnostics.sentencesCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Syntactic clauses</div>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-700/40">
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Lexical Diversity</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{diagnostics.lexicalDiversity}</div>
          <div className="text-xs text-gray-500 mt-0.5">Type-Token Ratio (TTR)</div>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-700/40">
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">AFINN Raw Score</div>
          <div className={`text-2xl font-black mt-1 ${diagnostics.afinnDetails.rawScore >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {diagnostics.afinnDetails.rawScore > 0 ? `+${diagnostics.afinnDetails.rawScore}` : diagnostics.afinnDetails.rawScore}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Lexicon sum score</div>
        </div>
      </div>

      {/* Grid for POS Breakdown & Named Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part-of-Speech Tagging */}
        <div className="bg-gray-800/30 p-6 rounded-3xl border border-gray-700/40 space-y-4">
          <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Grammatical Part-of-Speech (POS) Tagger
          </h4>
          <div className="space-y-2.5">
            {diagnostics.posBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">{item.tag}</span>
                <span className="font-bold text-white bg-gray-900/60 px-2.5 py-1 rounded-lg border border-gray-700">
                  {item.count} items
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Named Entity Recognition (NER) */}
        <div className="bg-gray-800/30 p-6 rounded-3xl border border-gray-700/40 space-y-4">
          <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" />
            Rule-Based & Statistical NER Entities
          </h4>
          {diagnostics.namedEntities.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No specific named entities detected in sample</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {diagnostics.namedEntities.map((ent, idx) => {
                let badgeStyle = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                if (ent.category === 'ORGANIZATION') badgeStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                if (ent.category === 'PLACE') badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                if (ent.category === 'TECH') badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                return (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-xl border flex items-center gap-1.5 font-medium ${badgeStyle}`}
                  >
                    <span>{ent.text}</span>
                    <span className="text-[9px] font-black opacity-75 uppercase">[{ent.category}]</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AFINN Lexical Sentiment Breakdown */}
      <div className="bg-gray-800/30 p-6 rounded-3xl border border-gray-700/40 space-y-4">
        <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          AFINN-165 Dictionary Matched Keywords
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 font-bold block mb-2">Positive Valence Words:</span>
            {diagnostics.afinnDetails.positiveWords.length === 0 ? (
              <span className="text-gray-500 italic">None</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {diagnostics.afinnDetails.positiveWords.map((word, i) => (
                  <span key={i} className="bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 px-2.5 py-1 rounded-lg font-medium">
                    +{word}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="text-gray-400 font-bold block mb-2">Negative Valence Words:</span>
            {diagnostics.afinnDetails.negativeWords.length === 0 ? (
              <span className="text-gray-500 italic">None</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {diagnostics.afinnDetails.negativeWords.map((word, i) => (
                  <span key={i} className="bg-red-950/60 text-red-300 border border-red-700/40 px-2.5 py-1 rounded-lg font-medium">
                    -{word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NlpPipelineInspector;
