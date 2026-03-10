import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Filter from '../components/Filter/Filter'
import Waterfall from '../components/Waterfall/Waterfall'
import SeriesCard from '../components/SeriesCard/SeriesCard'
import Lightbox from '../components/Lightbox/Lightbox'
import type { Series, Photo, FilterState } from '../types'
import { getSeriesByFilter, getAllTags, getPhotosBySeriesId } from '../lib/api'
import styles from './HomePage.module.css'

export default function HomePage() {
  const [filter, setFilter] = useState<FilterState>({
    tags: [],
    dateRange: { start: null, end: null },
    searchQuery: ''
  })
  const [series, setSeries] = useState<Series[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 系列预览状态
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)
  const [seriesPhotos, setSeriesPhotos] = useState<Photo[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  
  // 加载初始数据
  useEffect(() => {
    loadInitialData()
  }, [])
  
  async function loadInitialData() {
    try {
      setLoading(true)
      const [seriesData, tagsData] = await Promise.all([
        getSeriesByFilter(),
        getAllTags()
      ])
      setSeries(seriesData)
      setAvailableTags(tagsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 筛选数据
  useEffect(() => {
    if (!loading) {
      filterSeries()
    }
  }, [filter])
  
  async function filterSeries() {
    try {
      setLoading(true)
      const data = await getSeriesByFilter(
        filter.tags.length > 0 ? filter.tags : undefined,
        filter.searchQuery || undefined
      )
      setSeries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '筛选数据失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 打开系列预览
  const openSeriesPreview = async (seriesItem: Series) => {
    setSelectedSeries(seriesItem)
    setPreviewOpen(true)
    setLoadingPhotos(true)
    
    try {
      const photos = await getPhotosBySeriesId(seriesItem.id)
      // 如果照片数组为空，使用封面作为 fallback
      if (!photos || photos.length === 0) {
        setSeriesPhotos([{
          id: 'cover',
          image: seriesItem.cover_image,
          order: 0,
          album_id: seriesItem.id,
          created_at: seriesItem.created_at
        }])
      } else {
        setSeriesPhotos(photos)
      }
    } catch (err) {
      console.error('加载照片失败:', err)
      // 如果没有照片，至少显示封面
      setSeriesPhotos([{
        id: 'cover',
        image: seriesItem.cover_image,
        order: 0,
        album_id: seriesItem.id,
        created_at: seriesItem.created_at
      }])
    } finally {
      setLoadingPhotos(false)
    }
  }
  
  // 关闭预览
  const closePreview = () => {
    setPreviewOpen(false)
    setSelectedSeries(null)
    setSeriesPhotos([])
  }
  
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>MemoryFlow</h1>
            <p className={styles.subtitle}>每一个系列，都是一段故事</p>
          </div>
          
          <Filter 
            onFilterChange={setFilter}
            availableTags={availableTags}
          />
          
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={loadInitialData}>重试</button>
            </div>
          )}
          
          {loading && (
            <div className={styles.loading}>
              <p>加载中...</p>
            </div>
          )}
          
          {!loading && !error && series.length > 0 ? (
            <Waterfall gap={24} columnWidth={280}>
              {series.map((seriesItem, index) => (
                <SeriesCard 
                  key={seriesItem.id} 
                  series={seriesItem} 
                  index={index}
                  onClick={() => openSeriesPreview(seriesItem)}
                />
              ))}
            </Waterfall>
          ) : !loading && !error && series.length === 0 ? (
            <div className={styles.empty}>
              <p>还没有任何系列，去上传第一个吧！</p>
            </div>
          ) : null}
        </div>
      </main>
      
      {/* 系列照片预览组件 */}
      <Lightbox
        series={selectedSeries}
        photos={seriesPhotos}
        isOpen={previewOpen}
        onClose={closePreview}
      />
    </div>
  )
}
