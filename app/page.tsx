'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getItem, purchaseItem } from '@/lib/itemApi';
import UserAvatar from '@/components/UserAvatar';
import ItemCard from '@/components/ItemCard';
import StressTestControls from '@/components/StressTestControls';
import PurchaseLog from '@/components/PurchaseLog';
import type { Item, LogEntry } from '@/types';
import axios from 'axios';

let logIdCounter = 0;

function timestamp() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

export default function StorePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [buying, setBuying] = useState(false);
  const [stressTesting, setStressTesting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchItem();
  }, [isAuthenticated]);

  const fetchItem = async () => {
    setLoadingItem(true);
    try {
      const data = await getItem();
      setItem(data);
    } finally {
      setLoadingItem(false);
    }
  };

  const addLog = (log: Omit<LogEntry, 'id'>): number => {
    const id = ++logIdCounter;
    setLogs((prev) => [{ ...log, id }, ...prev]);
    return id;
  };

  const updateLog = (id: number, patch: Partial<LogEntry>) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const handleBuy = async () => {
    setBuying(true);
    const reqNum = logIdCounter + 1;
    const id = addLog({
      requestNumber: reqNum,
      timestamp: timestamp(),
      status: 'pending',
      message: '구매 요청 중...',
    });
    try {
      const data = await purchaseItem();
      updateLog(id, {
        status: 'success',
        message: '구매 성공',
        remainingQuantity: data.remainingQuantity,
      });
      await fetchItem();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? '구매 실패'
        : '구매 실패';
      updateLog(id, { status: 'failure', message: msg });
    } finally {
      setBuying(false);
    }
  };

  const handleStressTest = async (count: number) => {
    setStressTesting(true);

    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const id = addLog({
        requestNumber: logIdCounter + 1,
        timestamp: timestamp(),
        status: 'pending',
        message: '요청 대기 중...',
      });
      ids.push(id);
    }

    const requests = ids.map((id) =>
      purchaseItem()
        .then((data) => {
          updateLog(id, {
            status: 'success',
            message: '구매 성공',
            remainingQuantity: data.remainingQuantity,
          });
        })
        .catch((err) => {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? '구매 실패'
            : '구매 실패';
          updateLog(id, { status: 'failure', message: msg });
        })
    );

    await Promise.allSettled(requests);
    await fetchItem();
    setStressTesting(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm shadow-blue-50">
        <h1 className="text-xl font-bold text-blue-900">CEOS Market</h1>
        <UserAvatar />
      </header>

      {/* 메인 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {loadingItem ? (
          <div className="text-center text-gray-400 py-20">불러오는 중...</div>
        ) : item ? (
          <>
            <ItemCard item={item} onBuy={handleBuy} buying={buying} />

            <StressTestControls
              onStressTest={handleStressTest}
              loading={stressTesting || buying}
            />

            <div className="flex justify-end">
              <button
                onClick={fetchItem}
                className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                재고 새로고침
              </button>
            </div>

            <PurchaseLog logs={logs} onClear={() => setLogs([])} />
          </>
        ) : (
          <div className="text-center text-gray-400 py-20">상품을 불러올 수 없습니다.</div>
        )}
      </main>
    </div>
  );
}
