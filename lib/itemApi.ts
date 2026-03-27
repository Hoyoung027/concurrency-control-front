import axiosInstance from './axiosInstance';
import type { ApiResponse, Item, PurchaseResponseData } from '@/types';

export const getItem = () =>
  axiosInstance
    .get<ApiResponse<Item>>('/market/item')
    .then((r) => r.data.payload);

export const purchaseItem = () =>
  axiosInstance
    .post<ApiResponse<PurchaseResponseData>>('/market/item/purchase')
    .then((r) => r.data.payload);
