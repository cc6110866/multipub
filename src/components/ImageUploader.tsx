// src/components/ImageUploader.tsx
'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { imageUploadService } from '@/lib/upload/service'
import type { UploadResult } from '@/types/storage'

interface ImageUploaderProps {
  onUploadSuccess?: (url: string, markdown: string) => void
  onUploadError?: (error: string) => void
  children?: React.ReactNode
}

export default function ImageUploader({ 
  onUploadSuccess, 
  onUploadError,
  children 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 处理文件上传
  const handleFile = useCallback(async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // 模拟进度
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 100)

    try {
      const result: UploadResult = await imageUploadService.upload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url) {
        // 生成 Markdown 图片语法
        const alt = file.name.replace(/\.[^/.]+$/, '') // 移除扩展名
        const markdown = `![${alt}](${result.url})`
        
        onUploadSuccess?.(result.url, markdown)
      } else {
        onUploadError?.(result.error || '上传失败')
      }
    } catch (error: any) {
      clearInterval(progressInterval)
      onUploadError?.(error.message || '上传失败')
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }, [onUploadSuccess, onUploadError])

  // 处理拖拽
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // 处理拖拽放置
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  // 处理文件选择
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  // 处理粘贴
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            handleFile(file)
            e.preventDefault()
            break
          }
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handleFile])

  return (
    <div
      className={`relative ${dragActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* 子元素 */}
      {children}

      {/* 上传进度遮罩 */}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 mb-2">正在上传图片...</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        </div>
      )}

      {/* 拖拽提示 */}
      {dragActive && !isUploading && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-95 flex items-center justify-center z-40 rounded-lg border-2 border-dashed border-blue-400">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm font-medium text-blue-700">释放以上传图片</p>
          </div>
        </div>
      )}
    </div>
  )
}