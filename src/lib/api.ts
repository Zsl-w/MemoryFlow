import { supabase } from './supabase'
import type { Series, Photo } from '../types'

/**
 * 系列相关操作
 */

// 获取所有系列
export async function getAllSeries() {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('status', 'online')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Series[]
}

// 根据筛选条件获取系列
export async function getSeriesByFilter(tags?: string[], searchQuery?: string) {
  let query = supabase
    .from('series')
    .select('*')
    .eq('status', 'online')

  // 标签筛选
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags)
  }

  // 搜索筛选
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Series[]
}

// 根据 ID 获取系列详情
export async function getSeriesById(id: string) {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Series
}

// 创建新系列
export async function createSeries(series: Omit<Series, 'id' | 'photo_count' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('series')
    .insert([series])
    .select()
    .single()

  if (error) throw error
  return data as Series
}

// 更新系列
export async function updateSeries(id: string, updates: Partial<Series>) {
  const { data, error } = await supabase
    .from('series')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Series
}

// 删除系列
export async function deleteSeries(id: string) {
  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * 照片相关操作
 */

// 获取系列的所有照片
export async function getPhotosBySeriesId(seriesId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', seriesId)
    .order('order', { ascending: true })

  if (error) throw error
  return (data || []) as Photo[]
}

// 创建照片
export async function createPhoto(photo: Omit<Photo, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('photos')
    .insert([photo])
    .select()
    .single()

  if (error) throw error
  return data as Photo
}

// 批量创建照片
export async function createPhotos(photos: Array<Omit<Photo, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('photos')
    .insert(photos)
    .select()

  if (error) throw error
  return data as Photo[]
}

// 更新照片
export async function updatePhoto(id: string, updates: Partial<Photo>) {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Photo
}

// 删除照片
export async function deletePhoto(id: string) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * 辅助函数
 */

// 更新系列的照片数量
export async function updateSeriesPhotoCount(seriesId: string) {
  const { count, error: countError } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('album_id', seriesId)

  if (countError) throw countError

  const { error } = await supabase
    .from('series')
    .update({ photo_count: count })
    .eq('id', seriesId)

  if (error) throw error
}

// 获取所有可用标签
export async function getAllTags() {
  const { data, error } = await supabase
    .from('series')
    .select('tags')

  if (error) throw error

  // 提取所有唯一标签
  const tagsSet = new Set<string>()
  data?.forEach(item => {
    item.tags?.forEach((tag: string) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}
