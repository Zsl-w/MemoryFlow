import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header/Header'
import type { Photo, Series } from '../types'
import styles from './SeriesDetailPage.module.css'

// 临时 mock 数据
const mockSeries: Series = {
  id: '1',
  title: '东京物语',
  date: '2024.03',
  tags: ['胶片', '街头', '黑白'],
  description: '霓虹灯下的孤独行者，城市边缘的温柔瞬间',
  coverImage: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600',
  status: 'online',
  photoCount: 6,
  createdAt: '2024-03-15',
  updatedAt: '2024-03-15'
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
    order: 1,
    caption: '雨夜的涩谷十字路口',
    albumId: '1',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    order: 2,
    caption: '清晨的浅草寺',
    albumId: '1',
    createdAt: '2024-03-15'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
    order: 3,
    caption: '新宿的小巷',
    albumId: '1',
    createdAt: '2024-03-15'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    order: 4,
    caption: '代代木公园的午后',
    albumId: '1',
    createdAt: '2024-03-15'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    order: 5,
    caption: '银座的夜晚',
    albumId: '1',
    createdAt: '2024-03-15'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    order: 6,
    caption: '东京塔下',
    albumId: '1',
    createdAt: '2024-03-15'
  }
]

export default function SeriesDetailPage() {
  const { id } = useParams()
  
  // 在实际应用中，这里会根据 id 从 API 获取数据
  // 现在使用 mock 数据
  
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <Link to="/" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          
          <motion.header 
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>{mockSeries.title}</h1>
            <div className={styles.meta}>
              <span className={styles.date}>{mockSeries.date}</span>
              <span className={styles.separator}>·</span>
              <span className={styles.count}>{mockSeries.photoCount} 张照片</span>
            </div>
            {mockSeries.description && (
              <p className={styles.description}>{mockSeries.description}</p>
            )}
            <div className={styles.tags}>
              {mockSeries.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </motion.header>
          
          <div className={styles.gallery}>
            {mockPhotos.map((photo, index) => (
              <motion.figure
                key={photo.id}
                className={styles.photo}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={photo.image} 
                  alt={photo.caption || ''} 
                  className={styles.image}
                />
                {photo.caption && (
                  <figcaption className={styles.caption}>
                    {photo.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
