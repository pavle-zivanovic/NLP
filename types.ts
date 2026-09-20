
export interface Relation {
  subject: string;
  action: string;
  object: string;
  explanation: string;
}

export interface SentimentData {
  score: number; // -1 to 1
  label: string;
  emotions: string[];
}

export interface NamedEntity {
  text: string;
  category: string;
}

export interface NlpDiagnostics {
  tokensCount: number;
  sentencesCount: number;
  lexicalDiversity: number;
  posBreakdown: { tag: string; count: number }[];
  namedEntities: NamedEntity[];
  afinnDetails: {
    positiveWords: string[];
    negativeWords: string[];
    rawScore: number;
    comparative: number;
  };
  library: string;
}

export interface AnalysisResult {
  text: string;
  relations: Relation[];
  sentiment: SentimentData;
  summary: string;
  diagnostics?: NlpDiagnostics;
}

export interface RedditPost {
  title: string;
  author: string;
  content: string;
  url: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TopicStats {
  sentimentPulse: { label: string; value: number }[];
  topEntities: { name: string; category: string }[];
  themes: string[];
  intensityScore: number; // 0-100
}
