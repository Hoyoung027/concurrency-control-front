'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/lib/authApi';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi({ nickname, password });
      login(nickname, data.character, data.accessToken, data.refreshToken);
      // login() 이 호출되면 isAuthenticated가 true가 되고
      // 위 useEffect가 router.replace('/') 를 처리함
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.code;
        if (code === 'MEMBER_NOT_FOUND') setError('존재하지 않는 회원입니다.');
        else if (code === 'AUTHENTICATION_ERROR') setError('비밀번호가 올바르지 않습니다.');
        else setError(err.response?.data?.message ?? '로그인에 실패했습니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100 border border-blue-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1 text-blue-900">CEOS Market</h1>
        <p className="text-center text-blue-400 text-sm mb-6">로그인</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="text-center text-sm text-blue-400 mt-4">
          계정이 없으신가요?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
