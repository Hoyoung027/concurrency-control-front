'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signup as signupApi, login as loginApi } from '@/lib/authApi';
import { CHARACTER_EMOJI, type CharacterType } from '@/types';
import axios from 'axios';

const CHARACTER_LIST = Object.entries(CHARACTER_EMOJI) as [CharacterType, string][];

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [characterType, setCharacterType] = useState<CharacterType | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!characterType) {
      setError('캐릭터를 선택해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const signupData = await signupApi({ nickname, password, characterType });
      // 이모지를 localStorage에 저장해두고 로그인 시 복원
      localStorage.setItem('character', signupData.character);

      const loginData = await loginApi({ nickname, password });
      login(nickname, signupData.character, loginData.accessToken, loginData.refreshToken);
      // login() 호출 후 isAuthenticated가 true가 되면 useEffect가 redirect 처리
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.code;
        if (code === 'DUPLICATE_NAME') setError('이미 사용 중인 닉네임입니다.');
        else if (code === 'VALIDATION_ERROR') setError(err.response?.data?.message ?? '입력값을 확인해주세요.');
        else setError(err.response?.data?.message ?? '회원가입에 실패했습니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100 border border-blue-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1 text-blue-900">회원가입</h1>
        <p className="text-center text-blue-400 text-sm mb-6">캐릭터를 선택하고 시작하세요</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              placeholder="최대 20자"
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
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">캐릭터 선택</label>
            <div className="grid grid-cols-5 gap-2">
              {CHARACTER_LIST.map(([type, emoji]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCharacterType(type)}
                  className={`flex items-center justify-center rounded-full w-12 h-12 text-2xl border-2 transition-all ${
                    characterType === type
                      ? 'border-blue-500 bg-blue-100 scale-110 shadow-md shadow-blue-200'
                      : 'border-blue-100 bg-blue-50/50 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  title={type}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition-colors mt-2 shadow-sm shadow-blue-200"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="text-center text-sm text-blue-400 mt-4">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
