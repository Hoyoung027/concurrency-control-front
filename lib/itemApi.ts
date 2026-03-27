import axiosInstance from './axiosInstance';
import type { ApiResponse, Item, PurchaseResponseData, StatResponse } from '@/types';

const ITEM_ID = 1;

export const getItem = () =>
  axiosInstance
    .get<ApiResponse<Item>>('/market/item', { params: { itemId: ITEM_ID } })
    .then((r) => r.data.payload);

export const getStats = () =>
  axiosInstance
    .get<ApiResponse<StatResponse>>('/market/stats')
    .then((r) => r.data.payload);

export const purchaseItem = () =>
  axiosInstance
    .post<ApiResponse<PurchaseResponseData>>('/market/item/purchase', null, { params: { itemId: ITEM_ID } })
    .then((r) => r.data.payload);

export const resetItem = () =>
  axiosInstance
    .post<ApiResponse<void>>('/market/item/reset')
    .then((r) => r.data);
