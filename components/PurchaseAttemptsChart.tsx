'use client';

import { CHARACTER_EMOJI } from '@/types';

interface Props {
  data: Record<string, number>;
}

export default function PurchaseAttemptsChart({ data }: Props) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-blue-100 border border-blue-100 p-6 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-blue-700">사용자별 구매 시도</h3>
      <div className="flex flex-col gap-3">
        {entries.map(([nickname, count]) => (
          <div key={nickname} className="flex items-center gap-3">
            <span className="text-sm text-blue-800 font-medium w-20 truncate shrink-0">
              {nickname}
            </span>
            <div className="flex-1 bg-blue-50 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-blue-700 w-8 text-right shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
