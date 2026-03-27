'use client';

import type { LogEntry } from '@/types';

interface Props {
  logs: LogEntry[];
  onClear: () => void;
}

export default function PurchaseLog({ logs, onClear }: Props) {
  if (logs.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-blue-100 border border-blue-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-blue-900">요청 로그</h3>
        <button
          onClick={onClear}
          className="text-xs text-blue-300 hover:text-red-500 transition-colors"
        >
          지우기
        </button>
      </div>
      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto font-mono text-xs">
        {logs.map((log) => {
          const rowStyle =
            log.status === 'success'
              ? 'bg-blue-50 text-blue-800 border border-blue-100'
              : log.status === 'failure'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-blue-100/50 text-blue-500 border border-blue-100';

          return (
            <div key={log.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${rowStyle}`}>
              <span className="text-blue-300 shrink-0">{log.timestamp}</span>
              <span className="shrink-0">#{log.requestNumber}</span>
              <span className="font-semibold shrink-0">
                {log.status === 'pending' ? '대기' : log.status === 'success' ? '성공' : '실패'}
              </span>
              <span className="truncate">{log.message}</span>
              {log.remainingStock !== undefined && (
                <span className="ml-auto shrink-0 font-bold">
                  남은재고: {log.remainingStock}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
