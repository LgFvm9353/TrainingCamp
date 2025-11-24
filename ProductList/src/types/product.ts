// 商品规格选项
export interface ProductSpec {
  name: string; // 规格名称，如"颜色"、"尺寸"
  values: string[]; // 规格值列表
}

// 商品 SKU（库存单位）
export interface ProductSku {
  id: string;
  specs: Record<string, string>; // 规格组合，如 { color: "红色", size: "L" }
  price: number;
  stock: number;
  image?: string;
}

// 商品数据类型定义
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // 商品详情图片列表
  category: string;
  sales: number; // 销量
  rating: number; // 评分
  description?: string;
  detailDescription?: string; // 详细描述
  stock: number; // 库存
  specs?: ProductSpec[]; // 商品规格
  skus?: ProductSku[]; // SKU 列表
}

// 筛选条件类型
export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// 排序类型
export type SortType = 'default' | 'price_asc' | 'price_desc' | 'sales_desc';

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// API 响应类型
export interface ProductListResponse {
  list: Product[];
  total: number;
  page: number;
  pageSize: number;
}

