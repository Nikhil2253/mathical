/* ------------------------------------------------------------------ */
/*  Solver domain types                                               */
/*  Shared between the actions layer and any UI that consumes it.     */
/* ------------------------------------------------------------------ */

export interface Classification {
  subject?: string;
  chapter?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  grade_level?: string;
  problem_type?: string;
  mathematical_domain?: string;
  required_concepts?: string[];
  required_theorems?: string[];
  expected_strategy?: string;
}

export interface Summary {
  estimated_time?: string;
  steps_count?: number;
  concepts_used?: string[];
}

export interface SolveStep {
  step: number;
  title: string;
  explanation?: string;
  latex?: string;
}

export interface FinalAnswer {
  latex?: string;
  plain_text?: string;
}

export interface Verification {
  verified?: boolean;
  confidence?: number;
  method?: string;
  reasoning?: string;
  errors?: string[];
  corrections?: string[];
}

export interface AlternativeMethod {
  name: string;
  description: string;
}

export interface KeyFormula {
  name: string;
  latex: string;
}

export interface SimilarQuestion {
  difficulty: string;
  question: string;
}

export interface PracticeItem {
  id: number;
  question: string;
}

export interface ResourceItem {
  title: string;
  type: string;
}

export interface SolveResponse {
  question?: string;
  classification?: Classification;
  summary?: Summary;
  steps?: SolveStep[];
  final_answer?: FinalAnswer;
  verification?: Verification;
  alternative_methods?: AlternativeMethod[];
  key_formulae?: KeyFormula[];
  graph_data?: { enabled?: boolean };
  related_concepts?: string[];
  common_mistakes?: string[];
  tips?: string[];
  similar_questions?: SimilarQuestion[];
  practice_set?: PracticeItem[];
  next_topics?: string[];
  resources?: ResourceItem[];
}

export type TopicColor =
  | "sky"
  | "violet"
  | "success"
  | "secondary"
  | "pink"
  | "teal"
  | "primary";

export interface HistoricSession {
  id: string;
  question: string;
  topic: string;
  color: TopicColor;
  date: string;
}