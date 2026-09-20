import React, { useState } from 'react';
import { fetchRedditTopics, analyzeText } from './services/nlpService';
import { AnalysisResult, RedditPost, GroundingSource, TopicStats } from './types';
import RelationshipGraph from './components/RelationshipGraph';
import SentimentCard from './components/SentimentCard';
import TopicInsights from './components/TopicInsights';
import EntityAnalytics from './components/EntityAnalytics';
import NlpPipelineInspector from './components/NlpPipelineInspector';
import {
  MessageSquare,
  Search,
  Sparkles,
  Cpu,
  Terminal,
  ExternalLink,
  Zap,
  AlertCircle,
  X,
  Play,
  Share2,
  BookOpen,
  Smile
} from 'lucide-react';

const QUICK_TOPICS = [
  'Gaming',
  'TypeScript',
  'Linux',
  'Artificial Intelligence',
  'Technology'
];

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStats | null>(null);
  const [, setGroundingSources] = useState<GroundingSource[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [customText, setCustomText] = useState('');

  const handleSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    setSelectedResult(null);
    setTopicStats(null);
    try {
      const { posts, sources, stats } = await fetchRedditTopics(queryToSearch);
      setRedditPosts(posts);
      setTopicStats(stats);
      setGroundingSources(sources);
    } catch (error: any) {
      console.error("Search error:", error);
      setErrorMsg(`NLP error: ${error.message || 'Unable to process query.'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const result = await analyzeText(text);
      setSelectedResult(result);
      setTimeout(() => {
        document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (error: any) {
      console.error("Analysis error:", error);
      setErrorMsg(`Analysis error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-16">
      {/* Header */}
      <header className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="flex items-center gap-3">
          <div className="p-4 bg-red-600 rounded-3xl shadow-2xl shadow-red-900/40 rotate-3">
            <MessageSquare className="w-12 h-12 text-white -rotate-3" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-red-300 to-indigo-400 bg-clip-text text-transparent">
            Reddit NLP
          </h1>
        </div>
      </header>

      {errorMsg && (
        <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-5 rounded-r-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <span className="font-medium text-sm">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-red-300" />
          </button>
        </div>
      )}

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Dataset Fetcher */}
        <div className="xl:col-span-5 bg-gray-800/50 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-10 border border-gray-700 shadow-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center text-white">
              <span className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center mr-4 text-base font-black shadow-lg shadow-red-600/20">
                1
              </span>
              Topic Corpus
            </h2>
          </div>
          
          <form onSubmit={onFormSubmit} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reddit (e.g. artificial intelligence, technology...)"
                className="w-full bg-gray-900/80 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white font-black px-7 py-4 rounded-2xl transition-all shadow-xl hover:shadow-red-600/20 flex items-center gap-2 shrink-0 active:scale-95 text-sm"
            >
              {isSearching ? <span className="animate-spin">⏳</span> : 'Fetch'}
            </button>
          </form>

          {/* Quick topic buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-[11px] font-bold text-gray-500 flex items-center self-center mr-1">Quick:</span>
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSearchQuery(topic);
                  handleSearch(topic);
                }}
                className="text-xs bg-gray-900/60 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-xl border border-gray-700 hover:border-gray-500 transition-all font-medium"
              >
                {topic}
              </button>
            ))}
          </div>

          {topicStats && <TopicInsights stats={topicStats} />}

          <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {redditPosts.length === 0 && !isSearching && (
              <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700/50 rounded-[2rem] bg-gray-900/20 p-6 text-center">
                <Search className="w-8 h-8 text-gray-600 mb-2" />
                <p className="font-medium text-sm">Select or search a topic to load discussions and compute NLP statistics</p>
              </div>
            )}
            {redditPosts.map((post, idx) => (
              <div 
                key={idx} 
                className="bg-gray-900/60 p-5 rounded-3xl border border-gray-700 hover:border-red-500 transition-all cursor-pointer group hover:bg-gray-900 relative"
                onClick={() => {
                  const full = `${post.title}. ${post.content}`;
                  setCustomText(full);
                  handleAnalyze(full);
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-red-400 tracking-tighter bg-red-500/10 px-3 py-1 rounded-full">
                    u/{post.author}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Parse NLP
                    </span>
                    {post.url && (
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Open original thread"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-gray-100 mb-2 leading-snug group-hover:text-white transition-colors text-sm">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Analyzer */}
        <div className="xl:col-span-7 bg-gray-800/50 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-10 border border-gray-700 shadow-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center text-white">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center mr-4 text-base font-black shadow-lg shadow-indigo-600/20">
                2
              </span>
              Direct NLP Preprocessor
            </h2>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            <div className="relative flex-1">
              <textarea 
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste any text or discussion for open-source NLP parsing"
                className="w-full h-full min-h-[420px] lg:min-h-[480px] bg-gray-900/80 border border-gray-700 rounded-3xl p-6 lg:p-8 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500 leading-relaxed text-base resize-none"
              />
            </div>
            
            <button 
              onClick={() => handleAnalyze(customText)}
              disabled={isAnalyzing || !customText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl hover:shadow-indigo-600/30 flex items-center justify-center gap-4 text-lg active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin text-xl">⚡</span>
                  <span>Executing Compromise & AFINN NLP Pipeline...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-indigo-300" />
                  <span>Launch Semantic Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results Explorer */}
      <section id="analysis-section" className="pt-8">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white tracking-tight">Compromise NLP Processing</h3>
              <p className="text-indigo-400 font-medium text-sm mt-1 animate-pulse">
                Tagging Parts of Speech • Resolving SVO clauses • Computing AFINN sentiment
              </p>
            </div>
          </div>
        )}

        {selectedResult && !isAnalyzing && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 border border-gray-700 shadow-2xl border-t-indigo-500/40 space-y-12">
              
              {/* Analysis Header & Extractive Summary */}
              <div className="pb-8 border-b border-gray-700/60 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">Extractive Summary Output:</span>
                </div>
                <p className="text-indigo-200 font-bold text-xl lg:text-2xl italic leading-relaxed">
                  &ldquo;{selectedResult.summary}&rdquo;
                </p>
              </div>

              {/* SVO Triples & Sentiment Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
                <div className="xl:col-span-2 space-y-10">
                  <RelationshipGraph relations={selectedResult.relations} />
                  <EntityAnalytics relations={selectedResult.relations} />
                </div>
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-3">
                      <Smile className="w-6 h-6" />
                      Lexical Sentiment (AFINN)
                    </h3>
                    <SentimentCard data={selectedResult.sentiment} />
                  </div>
                </div>
              </div>

              {/* Open-Source NLP Pipeline Diagnostics */}
              {selectedResult.diagnostics && (
                <NlpPipelineInspector diagnostics={selectedResult.diagnostics} />
              )}

              {/* Raw Content Reference */}
              <div className="pt-8 border-t border-gray-700/50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Raw Processed Corpus
                </h4>
                <div className="bg-gray-900/60 p-6 lg:p-8 rounded-3xl text-gray-300 leading-relaxed text-sm lg:text-base border border-gray-800 font-mono">
                  {selectedResult.text}
                </div>
              </div>

            </div>
          </div>
        )}
      </section> 
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
    </div>
  );
};

export default App;
