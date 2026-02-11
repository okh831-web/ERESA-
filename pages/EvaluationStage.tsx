
import React, { useState } from 'react';
import { EvaluationStage, EvaluationReport, CriteriaItem } from '../types';
import { DEFAULT_CRITERIA_STAGE1, MOCK_SAMPLES } from '../constants';
import { runEvaluation } from '../services/geminiService';
import { getDeterminationColor, formatInternalDate } from '../utils/helpers';

interface EvaluationStageProps {
  stage: EvaluationStage;
  previousReports?: EvaluationReport[];
  onSave: (report: EvaluationReport) => void;
}

const EvaluationStagePage: React.FC<EvaluationStageProps> = ({ stage, previousReports, onSave }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [criteriaFiles, setCriteriaFiles] = useState<File[]>([]);
  const [evaluatorCount, setEvaluatorCount] = useState(3);
  const [thresholds, setThresholds] = useState({ pass: 70, conditional: 60 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationReport | null>(null);
  const [selectedPrevReportId, setSelectedPrevReportId] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setCriteriaFiles(Array.from(e.target.files));
  };

  const handleRunEvaluation = async () => {
    setLoading(true);
    try {
      const mockEvidence = [MOCK_SAMPLES.evidence];
      const prevReport = previousReports?.find(r => r.id === selectedPrevReportId);
      
      const analysis = await runEvaluation(
        stage,
        DEFAULT_CRITERIA_STAGE1,
        mockEvidence,
        evaluatorCount,
        thresholds,
        prevReport
      );

      const finalReport: EvaluationReport = {
        id: `REP-${Date.now()}`,
        title: `${stage} 교육과정 인증 평가 결과 보고서`,
        department: "컴퓨터공학과",
        stage,
        date: new Date().toISOString(),
        evaluatorCount,
        totalScore: analysis.totalScore || 0,
        determination: analysis.determination as any || "탈락",
        results: (analysis.results || []).map(r => ({ ...r, status: r.status as any })),
        overallComments: analysis.overallComments || "",
        recommendations: analysis.recommendations || { shortTerm: [], midTerm: [] },
        files: files.map(f => f.name),
        previousStageId: selectedPrevReportId,
        comparisonWithPrevious: analysis.comparisonWithPrevious
      };

      setResult(finalReport);
      onSave(finalReport);
    } catch (error) {
      console.error(error);
      alert("평가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate the HTML content string for HWP export
  const generateReportHTML = (data: EvaluationReport) => {
    const date = new Date(data.date);
    const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Malgun Gothic', 'Dotum', sans-serif; line-height: 1.6; }
          .title { text-align: center; font-size: 24pt; font-weight: bold; text-decoration: underline; margin-bottom: 20px; }
          .subtitle { text-align: center; font-size: 14pt; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
          th, td { border: 1px solid black; padding: 10px; font-size: 10pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .section-title { font-size: 12pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .red { color: red; }
          .footer { margin-top: 50px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="title">EReSA 교육과정 인증 평가 결과보고서</div>
        <div class="subtitle">[ ${data.stage} 심사 단계 ]</div>

        <div class="section-title">1. 평가 개요</div>
        <table>
          <tr>
            <th width="20%">평가 대상</th>
            <td width="30%">${data.department}</td>
            <th width="20%">평가 일시</th>
            <td width="30%">${formatInternalDate(data.date)}</td>
          </tr>
          <tr>
            <th>심사 단계</th>
            <td>${data.stage} 평가</td>
            <th>심사 위원</th>
            <td>${data.evaluatorCount}명</td>
          </tr>
          <tr>
            <th class="center">종합 점수</th>
            <td class="center bold" style="font-size: 12pt;">${data.totalScore} / 100</td>
            <th class="center">최종 판정</th>
            <td class="center bold" style="font-size: 12pt;">${data.determination}</td>
          </tr>
        </table>

        <div class="section-title">2. 종합 심사평</div>
        <div style="border: 1px solid black; padding: 15px; min-height: 100px;">
          ${data.overallComments.replace(/\n/g, '<br>')}
        </div>

        <div class="section-title">3. 항목별 세부 평가 결과</div>
        <table>
          <thead>
            <tr>
              <th width="10%" class="center">No</th>
              <th width="60%" class="center">평가 항목 및 근거 요약</th>
              <th width="15%" class="center">상태</th>
              <th width="15%" class="center">점수</th>
            </tr>
          </thead>
          <tbody>
            ${data.results.map((r, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td>
                  <div class="bold">[${r.criteriaId}]</div>
                  <div>${r.evidenceSummary}</div>
                  ${r.missingPoints.length > 0 ? `
                    <div class="red" style="margin-top: 5px;">
                      <b>※ 보완 필요사항:</b><br>
                      ${r.missingPoints.map(m => ` - ${m}`).join('<br>')}
                    </div>
                  ` : ''}
                </td>
                <td class="center bold">${r.status}</td>
                <td class="center bold">${r.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">4. 개선 권고 사항</div>
        <table>
          <tr>
            <th class="center" style="background-color: #e6e6e6;">가. 단기 개선 권고 (즉시 보완)</th>
          </tr>
          <tr>
            <td>
              ${data.recommendations.shortTerm.map(rec => `• ${rec}`).join('<br>')}
            </td>
          </tr>
          <tr>
            <th class="center" style="background-color: #e6e6e6;">나. 중기 개선 권고 (환류 전략)</th>
          </tr>
          <tr>
            <td>
              ${data.recommendations.midTerm.map(rec => `• ${rec}`).join('<br>')}
            </td>
          </tr>
        </table>

        <div class="footer">
          <p style="font-size: 14pt; font-weight: bold; margin-bottom: 40px;">위와 같이 교육과정 인증 평가 결과를 보고합니다.</p>
          <p style="font-size: 16pt; font-weight: bold;">${dateStr}</p>
          
          <table style="border: none; margin-top: 40px;">
            <tr>
              <td style="border: none; text-align: center;">
                <p>EReSA 평가위원장 (인)</p>
              </td>
              <td style="border: none; text-align: center;">
                <p>교육인증 센터장 (인)</p>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('팝업 차단이 설정되어 있습니다. 팝업을 허용해주세요.');
      return;
    }
    reportWindow.document.write(generateReportHTML(result));
    reportWindow.document.close();
  };

  const handleExportHWP = () => {
    if (!result) return;
    const htmlContent = generateReportHTML(result);
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.department}_EReSA_평가결과보고서.hwp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runDemo = () => {
    setFiles([new File([], "수요조사보고서_샘플.pdf")]);
    setCriteriaFiles([new File([], "1차평가기준_샘플.xlsx")]);
    handleRunEvaluation();
  };

  const ALLOWED_EXTENSIONS = ".pdf,.hwp,.hwpx,.xlsx,.xls";

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex items-center justify-between no-print">
        <h2 className="text-2xl font-bold text-slate-800">{stage} 평가 프로세스</h2>
        <div className="flex gap-2">
           <button 
            onClick={runDemo}
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
          >
            데모 실행
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 no-print">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-up text-indigo-500"></i>
              업로드 영역
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">평가 자료 (PDF, 한글, 엑셀)</label>
                <input 
                  type="file" 
                  multiple 
                  accept={ALLOWED_EXTENSIONS}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-slate-400">PDF, HWP, XLSX 파일을 지원합니다.</p>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">평가 기준 (PDF, 한글, 엑셀)</label>
                <input 
                  type="file" 
                  accept={ALLOWED_EXTENSIONS}
                  onChange={handleCriteriaChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                <p className="text-xs text-slate-400">인증 기준(루브릭) 파일을 업로드하십시오.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-indigo-500"></i>
              설정 영역
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 text-sm">위원 수</label>
                <input 
                  type="number" value={evaluatorCount} onChange={(e) => setEvaluatorCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 text-sm">통과 기준 (점)</label>
                <input 
                  type="number" value={thresholds.pass} onChange={(e) => setThresholds({...thresholds, pass: Number(e.target.value)})}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 text-sm">조건부 컷 (점)</label>
                <input 
                  type="number" value={thresholds.conditional} onChange={(e) => setThresholds({...thresholds, conditional: Number(e.target.value)})}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 gap-4 no-print">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <i className={`fa-solid fa-play text-2xl ${loading ? 'text-slate-300 animate-pulse' : 'text-indigo-600'}`}></i>
          </div>
          <p className="text-slate-500 text-center text-sm">
            설정이 완료되었으면<br/>분석을 시작하십시오.
          </p>
          <button
            onClick={handleRunEvaluation}
            disabled={loading || (files.length === 0 && !loading)}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all shadow-md ${
              loading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? '평가 분석 중...' : `${stage} 평가 실행`}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden no-print animate-slideUp">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">Analysis Result</span>
              <h3 className="text-2xl font-bold text-slate-900">{result.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{result.department} | 위원 수 {result.evaluatorCount}명 | {formatInternalDate(result.date)}</p>
            </div>
            <div className={`px-6 py-3 rounded-xl border-2 font-bold text-xl flex items-center gap-3 ${getDeterminationColor(result.determination)}`}>
              <span className="text-sm opacity-60">종합판정</span>
              {result.determination}
            </div>
          </div>

          <div className="p-8 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">총점</span>
                  <span className="text-3xl font-bold text-slate-800">{result.totalScore}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">충족률</span>
                  <span className="text-3xl font-bold text-slate-800">
                    {Math.round((result.results.filter(r => r.status === '충족').length / result.results.length) * 100)}%
                  </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">항목수</span>
                  <span className="text-3xl font-bold text-slate-800">{result.results.length}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">증빙자료</span>
                  <span className="text-3xl font-bold text-slate-800">{result.files.length}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-indigo-500"></i>
                항목별 세부 평가 결과
              </h4>
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 border-b border-slate-200 w-16 text-center">No</th>
                      <th className="px-4 py-3 border-b border-slate-200">근거 요약 및 세부평가</th>
                      <th className="px-4 py-3 border-b border-slate-200 w-24 text-center">상태</th>
                      <th className="px-4 py-3 border-b border-slate-200 w-20 text-center">점수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.results.map((r, i) => (
                      <tr key={i}>
                        <td className="px-4 py-4 text-center align-top font-mono text-slate-400">{i + 1}</td>
                        <td className="px-4 py-4 space-y-2">
                          <p className="font-semibold text-slate-800">{r.criteriaId}</p>
                          <p className="text-slate-600 leading-relaxed">{r.evidenceSummary}</p>
                          {r.missingPoints.length > 0 && (
                            <div className="mt-2 p-3 bg-rose-50 rounded-lg border border-rose-100">
                              <p className="text-xs font-bold text-rose-600 mb-1">보완 필요:</p>
                              {r.missingPoints.map((m, idx) => (
                                <p key={idx} className="text-xs text-rose-500 pl-2">• {m}</p>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center align-top">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            r.status === '충족' ? 'bg-emerald-100 text-emerald-700' : 
                            r.status === '부분충족' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center align-top font-bold text-slate-700">{r.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-clipboard-check text-indigo-500"></i>
                  단기 개선 권고
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.shortTerm.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-rocket text-indigo-500"></i>
                  중기 개선 권고
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.midTerm.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-8 no-print">
              <button 
                onClick={handleDownloadReport}
                className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-3"
              >
                <i className="fa-solid fa-print"></i>
                인쇄용 보기
              </button>
              <button 
                onClick={handleExportHWP}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-lg shadow-indigo-100"
              >
                <i className="fa-solid fa-file-word"></i>
                한글(HWP) 파일 다운로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationStagePage;
