/* ========================================
   MemoryFlow Types
   数据类型定义
   ======================================== */

export interface Photo {
  id: string
  image: string
  order: number
  caption?: string
  album_id: string
  created_at: string
}

export interface Series {
  id: string
  title: string
  date: string
  tags: string[]
  description?: string
  cover_image: string
  status: 'online' | 'offline'
  photo_count: number
  created_at: string
  updated_at: string
}

export interface FilterState {
  tags: string[]
  dateRange: {
    start: string | null
    end: string | null
  }
  searchQuery: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'creator' | 'viewer'
  created_at: string
}
