import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail } from '../../api/product';
import Header from '../../components/Header/Header';
import SpecSelector from '../../components/SpecSelector/SpecSelector';
import CartModal from '../../components/CartModal/CartModal';
import styles from './ProductDetail.module.css';
import type { Product } from '../../types/product';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductDetail(id);
        setProduct(data);
        // 初始化选中规格（选择每个规格的第一个选项）
        if (data.specs && data.specs.length > 0) {
          const initialSpecs: Record<string, string> = {};
          data.specs.forEach((spec) => {
            if (spec.values.length > 0) {
              initialSpecs[spec.name] = spec.values[0];
            }
          });
          setSelectedSpecs(initialSpecs);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSpecChange = (specName: string, value: string) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [specName]: value,
    }));
  };

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const maxStock = getCurrentStock();
    const newQuantity = Math.max(1, Math.min(maxStock, quantity + delta));
    setQuantity(newQuantity);
  };

  const getCurrentStock = (): number => {
    if (!product || !product.skus || product.skus.length === 0) {
      return product?.stock || 0;
    }

    // 根据选中的规格找到对应的 SKU
    const matchedSku = product.skus.find((sku) => {
      return Object.keys(selectedSpecs).every(
        (specName) => sku.specs[specName] === selectedSpecs[specName]
      );
    });

    return matchedSku?.stock || 0;
  };

  const getCurrentPrice = (): number => {
    if (!product || !product.skus || product.skus.length === 0) {
      return product?.price || 0;
    }

    const matchedSku = product.skus.find((sku) => {
      return Object.keys(selectedSpecs).every(
        (specName) => sku.specs[specName] === selectedSpecs[specName]
      );
    });

    return matchedSku?.price || product.price;
  };

  const handleAddToCart = () => {
    if (!product) return;
    setShowCartModal(true);
  };

  const images = product?.images && product.images.length > 0 ? product.images : [product?.image || ''];

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>
          <p>商品不存在</p>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const currentStock = getCurrentStock();
  const currentPrice = getCurrentPrice();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <div className={styles.productInfo}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <img src={images[selectedImage]} alt={product.name} />
              {discount > 0 && (
                <div className={styles.discountBadge}>
                  {discount}% OFF
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailList}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                    onClick={() => setSelectedImage(index)}
                    type="button"
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.meta}>
              <div className={styles.rating}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.ratingValue}>{(product.rating || 0).toFixed(1)}</span>
                <span className={styles.sales}>已售 {product.sales.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.priceSection}>
              <span className={styles.price}>¥{currentPrice}</span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className={styles.originalPrice}>¥{product.originalPrice}</span>
              )}
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className={styles.specsSection}>
                <SpecSelector
                  specs={product.specs}
                  selectedSpecs={selectedSpecs}
                  onSpecChange={handleSpecChange}
                />
              </div>
            )}

            <div className={styles.stockInfo}>
              库存：<span className={currentStock > 0 ? styles.inStock : styles.outOfStock}>
                {currentStock > 0 ? `${currentStock} 件` : '缺货'}
              </span>
            </div>

            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>数量：</span>
              <div className={styles.quantityControl}>
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.quantityInput}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const maxStock = getCurrentStock();
                    setQuantity(Math.max(1, Math.min(maxStock, val)));
                  }}
                  min={1}
                  max={currentStock}
                />
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actionSection}>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                type="button"
              >
                {currentStock > 0 ? '加入购物车' : '暂时缺货'}
              </button>
              <button className={styles.buyNowBtn} disabled={currentStock === 0} type="button">
                立即购买
              </button>
            </div>

            {product.description && (
              <div className={styles.description}>
                <div className={styles.descriptionTitle}>商品描述</div>
                <div className={styles.descriptionText}>{product.description}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        productName={product.name}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetailPage;

