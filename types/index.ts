export type CharacterType =
  | 'CAT'
  | 'DOG'
  | 'RABBIT'
  | 'DEER'
  | 'LION'
  | 'FOX'
  | 'BEAR'
  | 'PENGUIN'
  | 'HAMSTER'
  | 'FROG';

export const CHARACTER_EMOJI: Record<CharacterType, string> = {
  CAT: '🐱',
  DOG: '🐶',
  RABBIT: '🐰',
  DEER: '🫎',
  LION: '🦁',
  FOX: '🦊',
  BEAR: '🐻',
  PENGUIN: '🐧',
  HAMSTER: '🐹',
  FROG: '🐸',
};

export interface ApiResponse<T> {
  status: number;
  message: string;
  payload: T;
}

export interface SignupRequest {
  nickname: string;
  password: string;
  characterType: CharacterType;
}

export interface SignupResponseData {
  uuid: string;
  nickname: string;
  character: string;
}

export interface LoginRequest {
  nickname: string;
  password: string;
}

export interface LoginResponseData {
  nickname: string;
  character: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface StatResponse {
  purchaseAttempts: number;
  purchaseAttemptsByMember: Record<string, number>;
}

export interface PurchaseResponseData {
  itemName: string;
  remainingStock: number;
  memberUuid: string;
  memberNickname: string;
}

export interface LogEntry {
  id: number;
  requestNumber: number;
  timestamp: string;
  status: 'pending' | 'success' | 'failure';
  message: string;
  remainingStock?: number;
}
