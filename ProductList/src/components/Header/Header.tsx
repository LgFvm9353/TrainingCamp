import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>电商平台</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}>首页</a>
          <a href="#" className={styles.navItem}>商品</a>
          <a href="#" className={styles.navItem}>购物车</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

