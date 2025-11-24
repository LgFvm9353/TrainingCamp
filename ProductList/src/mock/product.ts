import Mock from 'mockjs';
import type { Product, ProductSpec, ProductSku } from '../types/product';

// 生成商品列表数据
export const generateProducts = (count: number = 100): Product[] => {
  const categories = ['电子产品', '服装配饰', '家居用品', '美妆护肤', '食品饮料', '运动户外', '图书文具'];
  
  return Mock.mock({
    [`list|${count}`]: [{
      'id|+1': 1,
      'name': '@ctitle(5, 15)',
      'price|50-5000': 1,
      'originalPrice|60-6000': 1,
      'image': Mock.Random.image('300x300', Mock.Random.color(), '#FFF', 'Product'),
      'category|1': categories,
      'sales|100-10000': 1,
      'description': '@cparagraph(1, 3)',
      'stock|10-500': 1,
    }]
  }).list.map((item: any) => {
    // 生成评分（3.5 到 5.0 之间，保留一位小数）
    const rating = Number((Math.random() * 1.5 + 3.5).toFixed(1));
    
    return {
      ...item,
      id: `product_${item.id}`,
      rating,
      // 确保原价大于现价
      originalPrice: item.originalPrice > item.price ? item.originalPrice : item.price + Mock.Random.integer(10, 100),
    };
  });
};

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成商品详情数据（包含规格和详情图片）
const generateProductDetail = (product: Product): Product => {
  const colors = ['红色', '蓝色', '绿色', '黑色', '白色', '灰色'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const hasSpecs = Math.random() > 0.3; // 70% 的商品有规格

  if (hasSpecs) {
    const specs: ProductSpec[] = [];
    const skus: ProductSku[] = [];

    // 随机生成规格（颜色和/或尺寸）
    if (Math.random() > 0.5) {
      specs.push({
        name: '颜色',
        values: Mock.Random.shuffle(colors).slice(0, Mock.Random.integer(2, 4)),
      });
    }

    if (Math.random() > 0.5 || specs.length === 0) {
      specs.push({
        name: '尺寸',
        values: Mock.Random.shuffle(sizes).slice(0, Mock.Random.integer(2, 4)),
      });
    }

    // 生成 SKU
    const colorValues = specs.find((s) => s.name === '颜色')?.values || [''];
    const sizeValues = specs.find((s) => s.name === '尺寸')?.values || [''];

    colorValues.forEach((color) => {
      sizeValues.forEach((size) => {
        const skuPrice = product.price + Mock.Random.integer(-50, 50);
        skus.push({
          id: `sku_${product.id}_${color}_${size}`,
          specs: {
            ...(color && { 颜色: color }),
            ...(size && { 尺寸: size }),
          },
          price: Math.max(50, skuPrice),
          stock: Mock.Random.integer(10, 200),
        });
      });
    });

    // 更新商品总库存为所有 SKU 库存之和
    const totalStock = skus.reduce((sum, sku) => sum + sku.stock, 0);
    product.stock = totalStock;
    product.specs = specs;
    product.skus = skus;
  }

  // 生成详情图片（包含主图 + 3-6张详情图）
  const detailImageCount = Mock.Random.integer(3, 6);
  const detailImages = [product.image, ...Array.from({ length: detailImageCount }, () =>
    Mock.Random.image('800x800', Mock.Random.color(), '#FFF', 'Detail')
  )];
  product.images = detailImages;
  product.detailDescription = Mock.Random.cparagraph(3, 6);

  return product;
};

// 缓存生成的产品列表，确保数据一致性
let cachedProducts: Product[] | null = null;

// 获取所有产品（带缓存）
const getAllProducts = (): Product[] => {
  if (!cachedProducts) {
    cachedProducts = generateProducts(150);
  }
  return cachedProducts;
};

// 模拟获取商品列表
export const mockGetProductList = async (params: {
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<{
  list: Product[];
  total: number;
  page: number;
  pageSize: number;
}> => {
  await delay(Mock.Random.integer(300, 800)); // 模拟网络延迟
  
  // 获取所有商品数据（使用缓存确保一致性）
  let allProducts = [...getAllProducts()]; 
  
  // 分类筛选
  if (params.category) {
    allProducts = allProducts.filter(product => product.category === params.category);
  }
  
  // 价格筛选
  if (params.minPrice !== undefined) {
    allProducts = allProducts.filter(product => product.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    allProducts = allProducts.filter(product => product.price <= params.maxPrice!);
  }
  
  // 排序
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case 'sales_desc':
        allProducts.sort((a, b) => b.sales - a.sales);
        break;
      default:
        break;
    }
  }
  
  const total = allProducts.length;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const list = allProducts.slice(start, end);
  
  return {
    list,
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
};

// 模拟获取商品详情
export const mockGetProductDetail = async (productId: string): Promise<Product> => {
  await delay(Mock.Random.integer(300, 600)); // 模拟网络延迟

  const allProducts = getAllProducts();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    throw new Error('Product not found');
  }

  // 生成并返回商品详情（包含规格、SKU、详情图片等）
  return generateProductDetail({ ...product });
};

