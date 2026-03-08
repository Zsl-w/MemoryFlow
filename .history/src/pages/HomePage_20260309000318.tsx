import { useState, useMemo } from 'react'
import Header from '../components/Header/Header'
import Filter from '../components/Filter/Filter'
import Waterfall from '../components/Waterfall/Waterfall'
import SeriesCard from '../components/SeriesCard/SeriesCard'
import type { Series, FilterState } from '../types'
import styles from './HomePage.module.css'

// 临时 mock 数据
const mockSeries: Series[] = [
  {
    id: '1',
    title: '东京物语',
    date: '2024.03',
    tags: ['胶片', '街头', '黑白'],
    description: '霓虹灯下的孤独行者，城市边缘的温柔瞬间',
    coverImage: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600',
    status: 'online',
    photoCount: 24,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    title: '海边的卡夫卡',
    date: '2024.02',
    tags: ['海边', '胶片', '人像'],
    description: '在浪潮声中寻找失落的名字',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    status: 'online',
    photoCount: 18,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  },
  {
    id: '3',
    title: '午后咖啡馆',
    date: '2024.01',
    tags: ['生活', '温暖'],
    description: '阳光洒在咖啡杯上的那个下午',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    status: 'online',
    photoCount: 12,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '4',
    title: '山间小路',
    date: '2023.12',
    tags: ['自然', '旅行', '胶片'],
    description: '穿过森林的微风，带着松木的香气',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    status: 'online',
    photoCount: 32,
    createdAt: '2023-12-05',
    updatedAt: '2023-12-05'
  },
  {
    id: '5',
    title: '午夜巴黎',
    date: '2023.11',
    tags: ['城市', '黑白'],
    description: '塞纳河畔的灯光，映照着百年前的影子',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    status: 'online',
    photoCount: 28,
    createdAt: '2023-11-20',
    updatedAt: '2023-11-20'
  },
  {
    id: '6',
    title: '旧时光',
    date: '2023.10',
    tags: ['胶片', '人像', '复古'],
    description: '泛黄的相纸上，定格的永恒瞬间',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600',
    status: 'online',
    photoCount: 16,
    createdAt: '2023-10-15',
    updatedAt: '2023-10-15'
  }
]

export default function HomePage() {
  const [filter, setFilter] = useState<FilterState>({
    tags: [],
    dateRange: { start: null, end: null },
    searchQuery: ''
  })
  
  // 获取所有可用标签
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    mockSeries.forEach(series => {
      series.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])
  
  // 筛选系列
  const filteredSeries = useMemo(() => {
    return mockSeries.filter(series => {
      // 搜索过滤
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        const matchesSearch = 
          series.title.toLowerCase().includes(query) ||
          (series.description?.toLowerCase().includes(query) ?? false) ||
          series.tags.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      
      // 标签过滤
      if (filter.tags.length > 0) {
        const hasAllTags = filter.tags.every(tag => series.tags.includes(tag))
        if (!hasAllTags) return false
      }
      
      return true
    })
  }, [filter])
  
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>PolaFlow</h1>
            <p className={styles.subtitle}>每一个系列，都是一段故事</p>
          </div>
          
          <Filter 
            onFilterChange={setFilter}
            availableTags={availableTags}
          />
          
          {filteredSeries.length > 0 ? (
            <Waterfall gap={24} columnWidth={280}>
              {filteredSeries.map((series, index) => (
                <SeriesCard key={series.id} series={series} index={index} />
              ))}
            </Waterfall>
          ) : (
            <div className={styles.empty}>
              <p>没有找到匹配的系列</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
