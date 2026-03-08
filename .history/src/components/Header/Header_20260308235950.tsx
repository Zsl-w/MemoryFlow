import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>PolaFlow</span>
          <span className={styles.logoSubtext}>私密写真展馆</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            系列
          </Link>
          <Link to="/upload" className={styles.navLink}>
            上传
          </Link>
        </nav>
      </div>
    </header>
  )
}
