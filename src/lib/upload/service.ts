// src/lib/upload/service.ts

import imageCompression from 'browser-image-compression'
import type { StorageConfig, UploadResult, UploadedImage } from '@/types/storage'

// 阿里云 OSS 类型声明
declare module 'ali-oss' {
  export default class OSS {
    constructor(options: {
      region: string
      bucket: string
      accessKeyId: string
      accessKeySecret: string
      secure?: boolean
    })
    put(key: string, file: File | Buffer): Promise<{ url: string; name: string }>
  }
}

export class ImageUploadService {
  private config: StorageConfig | null = null
  private uploadedImages: UploadedImage[] = []

  constructor() {
    this.loadConfig()
    this.loadUploadedImages()
  }

  // 加载配置
  private loadConfig() {
    const saved = localStorage.getItem('multipub-storage-config')
    if (saved) {
      try {
        this.config = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load storage config:', e)
      }
    }
  }

  // 保存配置
  saveConfig(config: StorageConfig) {
    this.config = config
    localStorage.setItem('multipub-storage-config', JSON.stringify(config))
  }

  // 获取当前配置
  getConfig(): StorageConfig | null {
    return this.config
  }

  // 加载已上传图片
  private loadUploadedImages() {
    const saved = localStorage.getItem('multipub-uploaded-images')
    if (saved) {
      try {
        this.uploadedImages = JSON.parse(saved)
      } catch (e) {
        this.uploadedImages = []
      }
    }
  }

  // 保存已上传图片
  private saveUploadedImages() {
    localStorage.setItem('multipub-uploaded-images', JSON.stringify(this.uploadedImages))
  }

  // 压缩图片
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.warn('Image compression failed, using original:', error)
      return file
    }
  }

  // 生成唯一文件名
  private generateFilename(originalName: string): string {
    const ext = originalName.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `multipub-${timestamp}-${random}.${ext}`
  }

  // 上传到阿里云 OSS
  private async uploadToAliyun(file: File): Promise<UploadResult> {
    if (!this.config?.aliyun) {
      return { success: false, error: '阿里云 OSS 配置缺失' }
    }

    try {
      const OSS = (await import('ali-oss')).default
      const client = new OSS({
        region: this.config.aliyun.region,
        bucket: this.config.aliyun.bucket,
        accessKeyId: this.config.aliyun.accessKeyId,
        accessKeySecret: this.config.aliyun.accessKeySecret,
        secure: true
      })

      const filename = this.generateFilename(file.name)
      const folder = this.config.aliyun.folder || 'multipub'
      const key = `${folder}/${filename}`

      const result = await client.put(key, file)
      
      return {
        success: true,
        url: result.url,
        filename: filename,
        size: file.size
      }
    } catch (error: any) {
      console.error('Aliyun upload error:', error)
      return {
        success: false,
        error: error.message || '上传失败'
      }
    }
  }

  // 上传到腾讯云 COS
  private async uploadToTencent(file: File): Promise<UploadResult> {
    if (!this.config?.tencent) {
      return { success: false, error: '腾讯云 COS 配置缺失' }
    }

    try {
      const COS = (await import('cos-js-sdk-v5')).default
      const cos = new COS({
        SecretId: this.config.tencent.secretId,
        SecretKey: this.config.tencent.secretKey,
      })

      const filename = this.generateFilename(file.name)
      const folder = this.config.tencent.folder || 'multipub'
      const key = `${folder}/${filename}`

      return new Promise((resolve) => {
        cos.putObject({
          Bucket: this.config!.tencent!.bucket,
          Region: this.config!.tencent!.region,
          Key: key,
          Body: file,
        }, (err, data) => {
          if (err) {
            resolve({ success: false, error: err.message })
          } else {
            const url = `https://${this.config!.tencent!.bucket}.cos.${this.config!.tencent!.region}.myqcloud.com/${key}`
            resolve({
              success: true,
              url,
              filename,
              size: file.size
            })
          }
        })
      })
    } catch (error: any) {
      console.error('Tencent upload error:', error)
      return { success: false, error: error.message }
    }
  }

  // 上传到自定义服务器
  private async uploadToCustom(file: File): Promise<UploadResult> {
    if (!this.config?.custom) {
      return { success: false, error: '自定义上传配置缺失' }
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(this.config.custom.uploadUrl, {
        method: 'POST',
        headers: this.config.custom.headers || {},
        body: formData
      })

      if (!response.ok) {
        return { success: false, error: `上传失败: ${response.status}` }
      }

      if (this.config.custom.responseFormat === 'json') {
        const data = await response.json()
        return {
          success: true,
          url: data.url || data.data?.url,
          filename: file.name,
          size: file.size
        }
      } else {
        const url = await response.text()
        return {
          success: true,
          url,
          filename: file.name,
          size: file.size
        }
      }
    } catch (error: any) {
      console.error('Custom upload error:', error)
      return { success: false, error: error.message }
    }
  }

  // 主上传方法
  async upload(file: File): Promise<UploadResult> {
    if (!this.config) {
      return { success: false, error: '请先配置图床' }
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '只支持图片文件' }
    }

    // 压缩图片
    const compressedFile = await this.compressImage(file)

    // 根据配置选择上传方式
    let result: UploadResult

    switch (this.config.provider) {
      case 'aliyun':
        result = await this.uploadToAliyun(compressedFile)
        break
      case 'tencent':
        result = await this.uploadToTencent(compressedFile)
        break
      case 'custom':
        result = await this.uploadToCustom(compressedFile)
        break
      default:
        result = { success: false, error: '未知的图床提供商' }
    }

    // 保存上传记录
    if (result.success && result.url) {
      const uploadedImage: UploadedImage = {
        id: Date.now().toString(),
        url: result.url,
        filename: result.filename || file.name,
        size: result.size || file.size,
        uploadedAt: Date.now()
      }
      this.uploadedImages.unshift(uploadedImage)
      
      // 只保留最近 100 张
      if (this.uploadedImages.length > 100) {
        this.uploadedImages = this.uploadedImages.slice(0, 100)
      }
      this.saveUploadedImages()
    }

    return result
  }

  // 获取已上传图片列表
  getUploadedImages(): UploadedImage[] {
    return this.uploadedImages
  }

  // 清空已上传图片记录
  clearUploadedImages() {
    this.uploadedImages = []
    this.saveUploadedImages()
  }
}

// 单例导出
export const imageUploadService = new ImageUploadService()