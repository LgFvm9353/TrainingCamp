import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductList } from '../../api/product';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import SortBar from '../../components/SortBar/SortBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ProductList.module.css';
import type { Product, FilterParams, SortType } from '../../types/product';

const PRODUCTS_PER_PAGE = 12;
const CATEGORIES = ['电子产品', '服装配饰', '家居用品', '美妆护肤', '食品饮料', '运动户外', '图书文具'];

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterParams>({});
  const [sortType, setSortType] = useState<SortType>('default');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductList(
        { page: currentPage, pageSize: PRODUCTS_PER_PAGE },
        filters,
        sortType
      );
      setProducts(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sortType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 当筛选或排序改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortType]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortType) => {
    setSortType(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <Filter categories={CATEGORIES} onFilterChange={handleFilterChange} />
        </aside>
        
        <main className={styles.main}>
          <SortBar sortType={sortType} onSortChange={handleSortChange} total={total} />
          
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>加载中...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <p>暂无商品</p>
            </div>
          ) : (
            <>
              <div className={styles.productGrid}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={PRODUCTS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

