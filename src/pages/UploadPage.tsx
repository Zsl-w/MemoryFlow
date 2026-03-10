import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import { createSeries, createPhotos, updateSeriesPhotoCount } from '../lib/api'
import { supabase } from '../lib/supabase'
import styles from './UploadPage.module.css'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_FILES = 50 // 最多50张

export default function UploadPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 组件卸载时清理所有预览 URL
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])
  
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // 检查文件数量限制
      if (files.length + newFiles.length > MAX_FILES) {
        alert(`最多只能上传 ${MAX_FILES} 张照片`)
        return
      }

      // 过滤超大文件并创建预览 URL
      const validFiles: File[] = []
      const newUrls: string[] = []

      newFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`文件 "${file.name}" 超过 20MB 限制，已跳过`)
          return
        }
        validFiles.push(file)
        newUrls.push(URL.createObjectURL(file))
      })

      setFiles(prev => [...prev, ...validFiles])
      setPreviewUrls(prev => [...prev, ...newUrls])
    }
  }

  const handleRemoveFile = (index: number) => {
    // 释放对应的预览 URL
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('请输入系列标题')
      return
    }
    
    if (files.length === 0) {
      alert('请至少上传一张照片')
      return
    }
    
    try {
      setUploading(true)
      setUploadProgress(0)
      
      // 1. 上传图片到 Supabase Storage
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `photos/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file)
        
        if (uploadError) {
          throw new Error(`上传图片失败: ${uploadError.message}`)
        }
        
        // 获取公开 URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        
        uploadedUrls.push(publicUrl)
        setUploadProgress(Math.round(((i + 1) / files.length) * 50))
      }
      
      // 2. 创建系列
      const currentDate = new Date()
      const dateStr = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}`
      
      const newSeries = await createSeries({
        title: title.trim(),
        description: description.trim() || undefined,
        tags,
        date: dateStr,
        cover_image: uploadedUrls[0],
        status: 'online'
      })
      
      setUploadProgress(60)
      
      // 3. 创建照片记录
      const photosData = uploadedUrls.map((url, index) => ({
        image: url,
        order: index,
        caption: undefined,
        album_id: newSeries.id
      }))
      
      await createPhotos(photosData)
      setUploadProgress(80)
      
      // 4. 更新系列照片数量
      await updateSeriesPhotoCount(newSeries.id)
      setUploadProgress(100)
      
      // 5. 跳转到系列详情页
      alert('上传成功！')
      navigate(`/series/${newSeries.id}`)
      
    } catch (err) {
      console.error('上传失败:', err)
      alert(err instanceof Error ? err.message : '上传失败，请重试')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }
  
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>上传新系列</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 基本信息 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>基本信息</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>系列标题 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给这个系列起个名字..."
                  className={styles.input}
                  disabled={uploading}
                  required
                />
              </div>
              
              <div className={styles.field}>
                <label className={styles.label}>一句话描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="讲讲这个系列的故事..."
                  className={styles.textarea}
                  rows={3}
                  disabled={uploading}
                />
              </div>
              
              <div className={styles.field}>
                <label className={styles.label}>标签</label>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="输入标签后按 Enter 添加..."
                    className={styles.input}
                    disabled={uploading}
                  />
                  <div className={styles.tags}>
                    {tags.map(tag => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={styles.tagRemove}
                          disabled={uploading}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* 照片上传 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>照片 *</h2>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  disabled={uploading}
                />
                <label htmlFor="photos" className={`${styles.uploadLabel} ${uploading ? styles.disabled : ''}`}>
                  <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>点击选择照片或拖拽到这里</span>
                  <span className={styles.uploadHint}>支持 JPG, PNG, HEIC 格式</span>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className={styles.previewGrid}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.previewItem}>
                      <img
                        src={previewUrls[index]}
                        alt={`预览 ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className={styles.removeButton}
                        disabled={uploading}
                      >
                        ×
                      </button>
                      <span className={styles.fileName}>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {uploading && (
              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className={styles.progressText}>上传中... {uploadProgress}%</p>
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={uploading}
            >
              {uploading ? '上传中...' : '发布系列'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
