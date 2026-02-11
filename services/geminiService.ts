
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationStage, EvaluationReport, CriteriaItem } from "../types";

export const runEvaluation = async (
  stage: EvaluationStage,
  criteria: CriteriaItem[],
  evidenceTexts: string[],
  evaluatorCount: number,
  thresholds: { pass: number; conditional: number },
  previousReport?: EvaluationReport
): Promise<Partial<EvaluationReport>> => {
  // Always initialize with the latest API key as per rules
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    당신은 대학 교육과정 인증(EReSA) 평가보조 AI입니다.
    사용자가 제공한 평가기준(Criteria)과 증빙자료(Evidence)를 분석하여 상세 평가 결과를 생성하세요.
    결과는 반드시 JSON 형식으로 반환해야 합니다.
    민감정보(주민번호, 전화번호 등)가 증빙에 포함된 경우 자동으로 마스킹(***) 처리하여 요약하세요.
    문장은 간결한 행정 문서 스타일로 작성하고 굵은 글씨는 사용하지 마세요.
  `;

  const prompt = `
    평가 단계: ${stage}
    평가 위원 수: ${evaluatorCount}
    통과 기준: ${thresholds.pass}점 이상, 조건부: ${thresholds.conditional}점 이상
    
    평가 기준 리스트:
    ${JSON.stringify(criteria)}

    제공된 증빙 자료 텍스트 요약:
    ${evidenceTexts.join("\n\n")}

    ${previousReport ? `이전 단계(1차) 결과와의 비교가 필요합니다. 이전 결과 요약: ${previousReport.overallComments}` : ""}

    다음 스키마에 따라 분석 결과를 생성하십시오.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalScore: { type: Type.NUMBER },
          determination: { type: Type.STRING }, // 통과, 조건부통과, 탈락
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criteriaId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                status: { type: Type.STRING }, // 충족, 부분충족, 미충족
                evidenceSummary: { type: Type.STRING },
                evidenceLocation: { type: Type.STRING },
                missingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                comments: { type: Type.STRING }
              },
              required: ["criteriaId", "score", "status", "evidenceSummary"]
            }
          },
          overallComments: { type: Type.STRING },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              shortTerm: { type: Type.ARRAY, items: { type: Type.STRING } },
              midTerm: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          comparisonWithPrevious: { type: Type.STRING }
        },
        required: ["totalScore", "determination", "results", "overallComments", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};
