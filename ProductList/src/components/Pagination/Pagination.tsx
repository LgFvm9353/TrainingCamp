import styles from './Pagination.module.css';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ current, total, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (current > 1) {
      onPageChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < totalPages) {
      onPageChange(current + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pageBtn} ${current === 1 ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={current === 1}
      >
        上一页
      </button>
      
      <div className={styles.pageNumbers}>
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`${styles.pageBtn} ${current === page ? styles.active : ''}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button
        className={`${styles.pageBtn} ${current === totalPages ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={current === totalPages}
      >
        下一页
      </button>
    </div>
  );
};

export default Pagination;

