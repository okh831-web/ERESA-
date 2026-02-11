
import React, { useState } from 'react';
import { EvaluationReport } from '../types';
import { getDeterminationColor, formatInternalDate } from '../utils/helpers';

interface HistoryProps {
  reports: EvaluationReport[];
}

const History: React.FC<HistoryProps> = ({ reports }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">평가 이력 관리</h2>
          <p className="text-slate-500 text-sm">진행된 모든 교육과정 인증 평가 기록을 확인하고 버전별로 비교할 수 있습니다.</p>
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="학과 또는 보고서 제목 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 text-2xl">
              <i className="fa-solid fa-inbox"></i>
            </div>
            <p className="text-slate-500">아직 생성된 평가 이력이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">평가 일자</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">대상 학과 및 단계</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">점수</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">종합 판정</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">주요 보완요청 요약</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 block">{formatInternalDate(report.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800 block">{report.department}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-1 inline-block">{report.stage} 평가</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-slate-700">{report.totalScore}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getDeterminationColor(report.determination)}`}>
                        {report.determination}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-500 truncate">
                        {report.recommendations.shortTerm[0] || "특이사항 없음"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <i className="fa-solid fa-file-export"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
