import styles from './ProductCard.module.css';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {discount > 0 && (
          <div className={styles.discountBadge}>
            {discount}% OFF
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name} title={product.name}>
          {product.name}
        </h3>
        <div className={styles.rating}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.ratingValue}>{(product.rating || 0).toFixed(1)}</span>
        </div>
        <div className={styles.priceSection}>
          <span className={styles.price}>¥{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>¥{product.originalPrice}</span>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.sales}>已售 {product.sales.toLocaleString()}</span>
          <span className={styles.stock}>库存 {product.stock}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

