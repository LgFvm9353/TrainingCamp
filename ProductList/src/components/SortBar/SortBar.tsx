import { useState, useRef, useEffect } from 'react';
import styles from './SortBar.module.css';
import type { SortType } from '../../types/product';

interface SortBarProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  total: number;
}

const SortBar = ({ sortType, onSortChange, total }: SortBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'default', label: '默认排序' },
    { value: 'price_asc', label: '价格从低到高' },
    { value: 'price_desc', label: '价格从高到低' },
    { value: 'sales_desc', label: '销量排序' },
  ];

  const currentLabel = sortOptions.find(opt => opt.value === sortType)?.label || '默认排序';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: SortType) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.sortBar}>
      <div className={styles.total}>
        共找到 <span className={styles.totalNumber}>{total}</span> 件商品
      </div>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button
          className={styles.dropdownTrigger}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span>{currentLabel}</span>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.dropdownItem} ${sortType === option.value ? styles.active : ''}`}
                onClick={() => handleSelect(option.value)}
                type="button"
              >
                {option.label}
                {sortType === option.value && (
                  <svg
                    className={styles.checkIcon}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortBar;

