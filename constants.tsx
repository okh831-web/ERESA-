
import { CriteriaItem } from './types';

export const DEFAULT_CRITERIA_STAGE1: CriteriaItem[] = [
  {
    id: '1-1',
    domain: '교육목표 및 역량',
    item: '전공역량 설정의 타당성',
    subCriteria: '산업체 및 사회 수요 분석 결과가 반영되어 있는가?',
    maxScore: 20,
    evidenceExample: '수요조사 보고서, 회의록',
    checkPoint: '최신성 확보 여부'
  },
  {
    id: '1-2',
    domain: '교육과정 설계',
    item: '교과목과 역량의 매핑',
    subCriteria: '모든 교과목이 1개 이상의 전공역량과 논리적으로 연결되었는가?',
    maxScore: 30,
    evidenceExample: '역량 기반 교육과정 로드맵',
    checkPoint: '연계성 수준'
  }
];

export const MOCK_SAMPLES = {
  evidence: "본 교육과정은 2024년 상반기 산업체 수요조사(n=150) 결과를 바탕으로 설계되었습니다. 특히 AI 융합 실무 역량에 대한 수요가 85%로 나타나 '지능형시스템기초' 교과목을 필수 역량으로 지정하였습니다. (참조: 수요조사결과보고서 p.12)",
};
