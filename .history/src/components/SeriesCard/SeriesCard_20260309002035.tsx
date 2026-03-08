import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Series } from '../../types'
import styles from './SeriesCard.module.css'

interface SeriesCardProps {
  series: Series
  index: number
}

export default function SeriesCard({ series, index }: SeriesCardProps) {
  // 随机轻微旋转角度 (-3deg 到 3deg)
  const rotation = ((index % 5) - 2) * 1.5
  
  return (
    <motion.div
      className={styles.card}
      style={{ 
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        rotate: 0,
        transition: { duration: 0.2 }
      }}
    >
      <Link to={`/series/${series.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img 
            src={series.cover_image} 
            alt={series.title}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.photoCount}>
            {series.photo_count} 张
          </div>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{series.title}</h3>
          {series.description && (
            <p className={styles.description}>{series.description}</p>
          )}
          <div className={styles.meta}>
            <span className={styles.date}>{series.date}</span>
            {series.tags.length > 0 && (
              <div className={styles.tags}>
                {series.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
