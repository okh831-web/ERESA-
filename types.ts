
export type EvaluationStage = '1차' | '2차' | '3차';

export type Determination = '통과' | '조건부통과' | '탈락';

export interface CriteriaItem {
  id: string;
  domain: string;
  item: string;
  subCriteria: string;
  maxScore: number;
  evidenceExample?: string;
  checkPoint?: string;
}

export interface EvaluationResultItem {
  criteriaId: string;
  score: number;
  status: '충족' | '부분충족' | '미충족';
  evidenceSummary: string;
  evidenceLocation: string;
  missingPoints: string[];
  comments: string;
}

export interface EvaluationReport {
  id: string;
  title: string;
  department: string;
  stage: EvaluationStage;
  date: string;
  evaluatorCount: number;
  totalScore: number;
  determination: Determination;
  results: EvaluationResultItem[];
  overallComments: string;
  recommendations: {
    shortTerm: string[];
    midTerm: string[];
  };
  files: string[];
  previousStageId?: string;
  comparisonWithPrevious?: string;
}

export interface AppState {
  history: EvaluationReport[];
}
