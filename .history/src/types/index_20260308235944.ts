/* ========================================
   PolaFlow Types
   数据类型定义
   ======================================== */

export interface Photo {
  id: string
  image: string
  order: number
  caption?: string
  albumId: string
  createdAt: string
}

export interface Series {
  id: string
  title: string
  date: string
  tags: string[]
  description?: string
  coverImage: string
  status: 'online' | 'offline'
  photoCount: number
  createdAt: string
  updatedAt: string
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
  createdAt: string
}
