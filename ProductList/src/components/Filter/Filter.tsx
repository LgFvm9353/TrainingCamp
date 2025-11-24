import { useState } from 'react';
import styles from './Filter.module.css';
import type { FilterParams } from '../../types/product';

interface FilterProps {
  categories: string[];
  onFilterChange: (filters: FilterParams) => void;
}

const Filter = ({ categories, onFilterChange }: FilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? '' : category;
    setSelectedCategory(newCategory);
    applyFilters(newCategory, minPrice, maxPrice);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setMinPrice(value);
      applyFilters(selectedCategory, value, maxPrice);
    } else {
      setMaxPrice(value);
      applyFilters(selectedCategory, minPrice, value);
    }
  };

  const applyFilters = (category: string, min: string, max: string) => {
    const filters: FilterParams = {};
    if (category) filters.category = category;
    if (min) filters.minPrice = Number(min);
    if (max) filters.maxPrice = Number(max);
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({});
  };

  return (
    <div className={styles.filter}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>商品分类</h3>
        <div className={styles.categoryList}>
          <button
            className={`${styles.categoryBtn} ${selectedCategory === '' ? styles.active : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>价格区间</h3>
        <div className={styles.priceRange}>
          <input
            type="number"
            placeholder="最低价"
            value={minPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className={styles.priceInput}
          />
          <span className={styles.priceSeparator}>-</span>
          <input
            type="number"
            placeholder="最高价"
            value={maxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className={styles.priceInput}
          />
        </div>
      </div>

      <button className={styles.resetBtn} onClick={resetFilters}>
        重置筛选
      </button>
    </div>
  );
};

export default Filter;

