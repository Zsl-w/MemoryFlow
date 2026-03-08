import { useState } from 'react'
import type { FilterState } from '../../types'
import styles from './Filter.module.css'

interface FilterProps {
  onFilterChange: (filter: FilterState) => void
  availableTags: string[]
}

export default function Filter({ onFilterChange, availableTags }: FilterProps) {
  const [filter, setFilter] = useState<FilterState>({
    tags: [],
    dateRange: { start: null, end: null },
    searchQuery: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  
  const handleTagToggle = (tag: string) => {
    const newTags = filter.tags.includes(tag)
      ? filter.tags.filter(t => t !== tag)
      : [...filter.tags, tag]
    
    const newFilter = { ...filter, tags: newTags }
    setFilter(newFilter)
    onFilterChange(newFilter)
  }
  
  const handleSearchChange = (query: string) => {
    const newFilter = { ...filter, searchQuery: query }
    setFilter(newFilter)
    onFilterChange(newFilter)
  }
  
  const clearFilters = () => {
    const newFilter: FilterState = {
      tags: [],
      dateRange: { start: null, end: null },
      searchQuery: ''
    }
    setFilter(newFilter)
    onFilterChange(newFilter)
  }
  
  const hasActiveFilters = filter.tags.length > 0 || filter.searchQuery.length > 0
  
  return (
    <div className={styles.filter}>
      <div className={styles.searchRow}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="搜索系列..."
            value={filter.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <button 
          className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
          </svg>
          筛选
          {hasActiveFilters && <span className={styles.badge} />}
        </button>
      </div>
      
      {showFilters && (
        <div className={styles.filterPanel}>
          {availableTags.length > 0 && (
            <div className={styles.filterSection}>
              <label className={styles.label}>标签</label>
              <div className={styles.tags}>
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`${styles.tag} ${filter.tags.includes(tag) ? styles.tagActive : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {hasActiveFilters && (
            <button className={styles.clearButton} onClick={clearFilters}>
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  )
}
