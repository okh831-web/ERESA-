
export const maskSensitiveInfo = (text: string): string => {
  // Simple masking for demonstration
  return text
    .replace(/\d{6}-\d{7}/g, "******-*******")
    .replace(/\d{3}-\d{4}-\d{4}/g, "010-****-****")
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "****@****.***");
};

export const getDeterminationColor = (det: string) => {
  switch (det) {
    case '통과': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case '조건부통과': return 'text-amber-600 bg-amber-50 border-amber-200';
    case '탈락': return 'text-rose-600 bg-rose-50 border-rose-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

export const formatInternalDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
