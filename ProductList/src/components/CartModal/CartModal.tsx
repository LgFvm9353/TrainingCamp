import { useEffect } from 'react';
import styles from './CartModal.module.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
}

const CartModal = ({ isOpen, onClose, productName, quantity }: CartModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>加入购物车成功</h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.message}>
            {productName} × {quantity} 已加入购物车
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.continueBtn} onClick={onClose} type="button">
            继续购物
          </button>
          <button className={styles.cartBtn} onClick={onClose} type="button">
            去购物车
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

