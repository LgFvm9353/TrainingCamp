import { mockGetProductList, mockGetProductDetail } from '../mock/product';
import type { ProductListResponse, FilterParams, SortType, PaginationParams, Product } from '../types/product';

// 获取商品列表
export const getProductList = async (
  pagination: PaginationParams,
  filters?: FilterParams,
  sort?: SortType
): Promise<ProductListResponse> => {
  const response = await mockGetProductList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    category: filters?.category,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    sort: sort || 'default',
  });
  
  return response;
};

// 获取商品详情
export const getProductDetail = async (productId: string): Promise<Product> => {
  return await mockGetProductDetail(productId);
};

