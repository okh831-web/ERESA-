
import React from 'react';

interface HomeProps {
  onStart: (stage: string) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section: EReSA Definition and Purpose */}
      <section className="relative bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-slate-200 overflow-hidden group">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-widest uppercase">
              <i className="fa-solid fa-shield-halved"></i> University Quality Assurance
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              EReSA <span className="text-indigo-600 font-black">정의와 목적</span>
            </h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="relative pl-6 border-l-4 border-indigo-600">
                <h4 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                  정의
                </h4>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                  역량기반 교육과정의 <span className="text-slate-900 underline decoration-indigo-300 underline-offset-4">설계-운영-환류 전 과정</span>을 평가기준으로 인증하여 교육 품질을 지속적으로 개선하는 내부 품질보증 체계
                </p>
              </div>

              <div className="relative pl-6 border-l-4 border-slate-200">
                <h4 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                  목적
                </h4>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                  전공역량 및 핵심역량 기반 교육과정의 타당성을 확보하고, 데이터 기반의 <span className="text-slate-900 font-bold">CQI 환류 체계를 정착</span>시켜 행정 절차의 투명성과 전문적인 심의를 지원합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Right side Image/Icon for Trust */}
          <div className="hidden lg:block w-72 h-72 relative">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-6 opacity-10 animate-pulse"></div>
            <div className="absolute inset-0 bg-slate-800 rounded-3xl -rotate-3 shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-indigo-500/20">
              <div className="text-6xl mb-4 text-indigo-400">
                <i className="fa-solid fa-medal"></i>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold tracking-widest uppercase opacity-60 mb-1">Certified by</p>
                <p className="text-2xl font-black">EReSA System</p>
                <div className="mt-4 pt-4 border-t border-white/10 w-full text-xs text-slate-400">
                  Trustworthy Intelligence<br/>for Education Quality
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-indigo-600 text-xl border border-slate-100">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-emerald-500 text-xl border border-slate-100">
              <i className="fa-solid fa-chart-line"></i>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute bottom-0 right-0 opacity-5 -mb-10 -mr-10">
              <i className="fa-solid fa-gears text-[15rem]"></i>
           </div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <i className="fa-solid fa-clipboard-list text-indigo-400"></i>
            평가위원회의 주요 기능
          </h3>
          <ul className="space-y-5 relative z-10">
            {[
              "평가기준 준거 심사 및 증빙자료 적정성 확인",
              "정량/정성 평가 결과에 따른 점수 산출 및 최종 판정",
              "보완요청 및 조건부 승인 사항 구체적 제시",
              "환류 권고안 도출 및 교육과정 개선 로드맵 지원",
              "심사 기록의 표준화 및 전주기 이력 관리"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-1 shrink-0 border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  {i + 1}
                </span>
                <span className="text-slate-300 group-hover:text-white transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center items-center p-10 border-2 border-dashed border-slate-300 rounded-3xl bg-white shadow-inner">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl mb-6">
            <i className="fa-solid fa-play"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">평가 프로세스 시작</h3>
          <p className="text-slate-500 text-center mb-10 max-w-sm leading-relaxed">
            인증 받고자 하는 심사 단계를 선택하십시오.<br/>
            AI가 증빙 자료를 정밀하게 분석하여 평가를 보조합니다.
          </p>
          <div className="grid grid-cols-1 w-full gap-4">
            <button
              onClick={() => onStart('stage1')}
              className="w-full py-5 px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-between shadow-lg shadow-indigo-200 group"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-medium">설계 및 타당성 검증</span>
                <span className="text-lg">1차 평가 시작</span>
              </div>
              <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button
              onClick={() => onStart('stage2')}
              className="w-full py-5 px-8 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-medium">운영 및 품질 관리</span>
                <span className="text-lg">2차 평가 시작</span>
              </div>
              <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100"></i>
            </button>
            <button
              onClick={() => onStart('stage3')}
              className="w-full py-5 px-8 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-medium">환류 및 성과 분석</span>
                <span className="text-lg">3차 평가 시작</span>
              </div>
              <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
