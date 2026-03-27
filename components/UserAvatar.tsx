'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserAvatar() {
  const { nickname, character, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!nickname || !character) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl border-2 border-blue-200 select-none shadow-sm">
        {character}
      </div>
      <span className="font-medium text-blue-900">{nickname}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-blue-300 hover:text-red-500 transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
}
