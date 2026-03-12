// src/types/storage.ts

export interface StorageConfig {
  provider: 'aliyun' | 'tencent' | 'qiniu' | 'custom'
  aliyun?: {
    region: string
    bucket: string
    accessKeyId: string
    accessKeySecret: string
    folder?: string
  }
  tencent?: {
    region: string
    bucket: string
    secretId: string
    secretKey: string
    folder?: string
  }
  qiniu?: {
    domain: string
    bucket: string
    accessKey: string
    secretKey: string
    folder?: string
  }
  custom?: {
    uploadUrl: string
    headers?: Record<string, string>
    responseFormat?: 'url' | 'json'
  }
}

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  filename?: string
  size?: number
}

export interface UploadedImage {
  id: string
  url: string
  filename: string
  size: number
  uploadedAt: number
}