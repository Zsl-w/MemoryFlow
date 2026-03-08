import { useState } from 'react'
import Header from '../components/Header/Header'
import styles from './UploadPage.module.css'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  
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
      setFiles([...files, ...newFiles])
    }
  }
  
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现上传逻辑
    console.log({ title, description, tags, files })
    alert('上传功能待实现（需要连接 Supabase 和腾讯云 COS）')
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
                <label className={styles.label}>系列标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给这个系列起个名字..."
                  className={styles.input}
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
                  />
                  <div className={styles.tags}>
                    {tags.map(tag => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={styles.tagRemove}
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
              <h2 className={styles.sectionTitle}>照片</h2>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                />
                <label htmlFor="photos" className={styles.uploadLabel}>
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
                        src={URL.createObjectURL(file)}
                        alt={`预览 ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                      <span className={styles.fileName}>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            <button type="submit" className={styles.submitButton}>
              发布系列
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
