import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Photo, Series } from '../../types'
import styles from './Lightbox.module.css'

interface LightboxProps {
  series: Series | null
  photos: Photo[]
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ 
  series, 
  photos, 
  isOpen, 
  onClose
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  
  // 重置索引当打开新的系列
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
    }
  }, [isOpen, series?.id])
  
  // 预加载所有图片
  useEffect(() => {
    if (!isOpen || photos.length === 0) return
    
    photos.forEach(photo => {
      if (!loadedImages.has(photo.image)) {
        const img = new Image()
        img.src = photo.image
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, photo.image]))
        }
      }
    })
  }, [photos, isOpen])
  
  // 切换图片
  const goToIndex = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < photos.length) {
      setCurrentIndex(newIndex)
    }
  }, [photos.length])
  
  // 键盘导航
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        if (currentIndex > 0) {
          goToIndex(currentIndex - 1)
        }
        break
      case 'ArrowRight':
        if (currentIndex < photos.length - 1) {
          goToIndex(currentIndex + 1)
        }
        break
    }
  }, [isOpen, currentIndex, photos.length, onClose, goToIndex])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!series || photos.length === 0) return null
  
  const currentPhoto = photos[currentIndex]
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* 预览容器 */}
          <div className={styles.previewContainer}>
            {/* 关闭按钮 */}
            <button className={styles.closeButton} onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            {/* 计数器 */}
            <div className={styles.counter}>
              {currentIndex + 1} / {photos.length}
            </div>
            
            {/* 轮播区域 */}
            <div className={styles.carousel}>
              {/* 左缩略图 */}
              {prevPhoto ? (
                <motion.button
                  className={styles.thumbLeft}
                  onClick={() => goToIndex(currentIndex - 1)}
                  initial={false}
                  animate={{ 
                    scale: 0.7, 
                    opacity: 0.6,
                    x: 0 
                  }}
                  whileHover={{ scale: 0.75, opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={prevPhoto.image} alt="上一张" />
                </motion.button>
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
              
              {/* 主图 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.id}
                  className={styles.mainImageWrapper}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ 
                    duration: 0.35,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <img 
                    src={currentPhoto.image} 
                    alt={currentPhoto.caption || series.title}
                    className={styles.mainImage}
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* 右缩略图 */}
              {nextPhoto ? (
                <motion.button
                  className={styles.thumbRight}
                  onClick={() => goToIndex(currentIndex + 1)}
                  initial={false}
                  animate={{ 
                    scale: 0.7, 
                    opacity: 0.6,
                    x: 0 
                  }}
                  whileHover={{ scale: 0.75, opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={nextPhoto.image} alt="下一张" />
                </motion.button>
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
            </div>
            
            {/* 信息面板 */}
            <motion.div 
              className={styles.infoPanel}
              key={`info-${currentPhoto.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* 图片标题 */}
              {currentPhoto.caption && (
                <p className={styles.photoCaption}>{currentPhoto.caption}</p>
              )}
              
              {/* 系列信息 */}
              <div className={styles.seriesInfo}>
                <h3 className={styles.seriesTitle}>{series.title}</h3>
                {series.description && (
                  <p className={styles.seriesDescription}>{series.description}</p>
                )}
                {series.tags.length > 0 && (
                  <div className={styles.tags}>
                    {series.tags.map((tag: string) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* 左右切换按钮 */}
            <div className={styles.navButtons}>
              <button 
                className={`${styles.navBtn} ${currentIndex === 0 ? styles.navBtnDisabled : ''}`}
                onClick={() => goToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>上一张</span>
              </button>
              <button 
                className={`${styles.navBtn} ${currentIndex === photos.length - 1 ? styles.navBtnDisabled : ''}`}
                onClick={() => goToIndex(currentIndex + 1)}
                disabled={currentIndex === photos.length - 1}
              >
                <span>下一张</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            
            {/* 底部导航点 */}
            <div className={styles.dots}>
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => goToIndex(index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
