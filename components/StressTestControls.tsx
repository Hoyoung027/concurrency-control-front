'use client';

interface Props {
  onStressTest: (count: number) => void;
  loading: boolean;
}

export default function StressTestControls({ onStressTest, loading }: Props) {
  const presets = [5, 10, 20, 50];

  return (
    <div className="bg-blue-600 rounded-2xl p-5 shadow-md shadow-blue-200">
      <h3 className="font-bold text-white mb-1">동시성 테스트</h3>
      <p className="text-sm text-blue-200 mb-4">
        여러 요청을 동시에 보내서 Race Condition을 확인해보세요.
      </p>
      <div className="flex gap-2 flex-wrap">
        {presets.map((count) => (
          <button
            key={count}
            onClick={() => onStressTest(count)}
            disabled={loading}
            className="px-4 py-2 bg-white hover:bg-blue-50 disabled:bg-blue-300 disabled:text-blue-100 text-blue-700 font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            {count}개 동시 요청
          </button>
        ))}
      </div>
    </div>
  );
}
