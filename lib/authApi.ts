import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  SignupRequest,
  SignupResponseData,
} from '@/types';

export const signup = (data: SignupRequest) =>
  axiosInstance
    .post<ApiResponse<SignupResponseData>>('/auth/signup', data)
    .then((r) => r.data.payload);

export const login = (data: LoginRequest) =>
  axiosInstance
    .post<ApiResponse<LoginResponseData>>('/auth/login', data)
    .then((r) => r.data.payload);
