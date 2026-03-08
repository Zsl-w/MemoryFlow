import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header/Header'
import type { Photo, Series } from '../types'
import { getSeriesById, getPhotosBySeriesId } from '../lib/api'
import styles from './SeriesDetailPage.module.css'

export default function SeriesDetailPage() {
  const { id } = useParams()
  const [series, setSeries] = useState<Series | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (id) {
      loadSeriesData(id)
    }
  }, [id])
  
  async function loadSeriesData(seriesId: string) {
    try {
      setLoading(true)
      const [seriesData, photosData] = await Promise.all([
        getSeriesById(seriesId),
        getPhotosBySeriesId(seriesId)
      ])
      setSeries(seriesData)
      setPhotos(photosData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>加载中...</div>
          </div>
        </main>
      </div>
    )
  }
  
  if (error || !series) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <p>{error || '系列不存在'}</p>
              <Link to="/">返回首页</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
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
            <h1 className={styles.title}>{series.title}</h1>
            <div className={styles.meta}>
              <span className={styles.date}>{series.date}</span>
              <span className={styles.separator}>·</span>
              <span className={styles.count}>{series.photo_count} 张照片</span>
            </div>
            {series.description && (
              <p className={styles.description}>{series.description}</p>
            )}
            <div className={styles.tags}>
              {series.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </motion.header>
          
          <div className={styles.gallery}>
            {photos.map((photo, index) => (
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
