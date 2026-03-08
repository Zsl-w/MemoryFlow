import { useRef, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import styles from './Waterfall.module.css'

interface WaterfallProps {
  children: ReactNode[]
  gap?: number
  columnWidth?: number
}

interface ColumnHeight {
  index: number
  height: number
}

export default function Waterfall({ 
  children, 
  gap = 24, 
  columnWidth = 280 
}: WaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState<ReactNode[][]>([])
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  
  // 计算需要的列数
  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return 1
    
    const containerWidth = containerRef.current.offsetWidth
    const numColumns = Math.max(1, Math.floor(containerWidth / columnWidth))
    return numColumns
  }, [columnWidth])
  
  // 重新分配卡片到各列
  const redistributeItems = useCallback(() => {
    const numColumns = calculateColumns()
    const newColumns: ReactNode[][] = Array.from({ length: numColumns }, () => [])
    const newHeights: number[] = Array(numColumns).fill(0)
    
    // 将每个子元素分配到最短的列
    children.forEach((child) => {
      // 找到最短的列
      const minHeightIndex = newHeights.indexOf(Math.min(...newHeights))
      newColumns[minHeightIndex].push(child)
      // 估算高度（实际高度需要渲染后才能确定）
      newHeights[minHeightIndex] += 320 // 平均卡片高度
    })
    
    setColumns(newColumns)
    setColumnHeights(newHeights)
  }, [children, calculateColumns])
  
  useEffect(() => {
    redistributeItems()
    
    // 监听窗口大小变化
    const handleResize = () => {
      redistributeItems()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [redistributeItems])
  
  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ gap: `${gap}px` }}
    >
      {columns.map((column, columnIndex) => (
        <div 
          key={columnIndex} 
          className={styles.column}
          style={{ gap: `${gap}px` }}
        >
          {column.map((item, itemIndex) => (
            <div key={itemIndex} className={styles.item}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
