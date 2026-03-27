'use client';

import type { Item } from '@/types';

interface Props {
  item: Item;
  onBuy: () => void;
  buying: boolean;
}

export default function ItemCard({ item, onBuy, buying }: Props) {
  const stockColor =
    item.quantity === 0
      ? 'text-red-600 bg-red-50'
      : item.quantity <= 10
      ? 'text-orange-600 bg-orange-50'
      : 'text-green-700 bg-green-50';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-blue-100 border border-blue-100 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-900">{item.name}</h2>
          <p className="text-blue-400 text-sm mt-1">
            {item.price.toLocaleString()}원
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${stockColor}`}>
          재고 {item.quantity}개
        </div>
      </div>

      <div className="text-sm text-blue-400">
        총 구매 시도: <span className="font-semibold text-blue-700">{item.purchaseAttempts}회</span>
      </div>

      <button
        onClick={onBuy}
        disabled={buying || item.quantity === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm shadow-blue-200"
      >
        {buying ? '구매 중...' : item.quantity === 0 ? '품절' : '구매하기'}
      </button>
    </div>
  );
}
