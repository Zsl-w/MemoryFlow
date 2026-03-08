import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Filter from '../components/Filter/Filter'
import Waterfall from '../components/Waterfall/Waterfall'
import SeriesCard from '../components/SeriesCard/SeriesCard'
import type { Series, FilterState } from '../types'
import { getSeriesByFilter, getAllTags } from '../lib/api'
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
                <SeriesCard key={seriesItem.id} series={seriesItem} index={index} />
              ))}
            </Waterfall>
          ) : !loading && !error && series.length === 0 ? (
            <div className={styles.empty}>
              <p>还没有任何系列，去上传第一个吧！</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
