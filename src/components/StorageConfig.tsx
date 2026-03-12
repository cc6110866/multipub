// src/components/StorageConfig.tsx
'use client'

import { useState, useEffect } from 'react'
import { imageUploadService } from '@/lib/upload/service'
import type { StorageConfig } from '@/types/storage'

const PROVIDERS = [
  { id: 'aliyun', name: '阿里云 OSS', icon: '☁️' },
  { id: 'tencent', name: '腾讯云 COS', icon: '☁️' },
  { id: 'custom', name: '自定义', icon: '⚙️' },
]

export default function StorageConfig() {
  const [config, setConfig] = useState<StorageConfig>({
    provider: 'aliyun',
    aliyun: {
      region: '',
      bucket: '',
      accessKeyId: '',
      accessKeySecret: '',
      folder: 'multipub'
    }
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const currentConfig = imageUploadService.getConfig()
    if (currentConfig) {
      setConfig(currentConfig)
    }
  }, [])

  const handleSave = () => {
    imageUploadService.saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const renderAliyunConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Region
        </label>
        <input
          type="text"
          placeholder="oss-cn-hangzhou"
          value={config.aliyun?.region || ''}
          onChange={(e) => setConfig({
            ...config,
            aliyun: { ...config.aliyun!, region: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">如：oss-cn-hangzhou、oss-cn-beijing</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bucket
        </label>
        <input
          type="text"
          placeholder="your-bucket-name"
          value={config.aliyun?.bucket || ''}
          onChange={(e) => setConfig({
            ...config,
            aliyun: { ...config.aliyun!, bucket: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AccessKey ID
        </label>
        <input
          type="text"
          placeholder="AccessKey ID"
          value={config.aliyun?.accessKeyId || ''}
          onChange={(e) => setConfig({
            ...config,
            aliyun: { ...config.aliyun!, accessKeyId: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AccessKey Secret
        </label>
        <input
          type="password"
          placeholder="AccessKey Secret"
          value={config.aliyun?.accessKeySecret || ''}
          onChange={(e) => setConfig({
            ...config,
            aliyun: { ...config.aliyun!, accessKeySecret: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          存储文件夹
        </label>
        <input
          type="text"
          placeholder="multipub"
          value={config.aliyun?.folder || ''}
          onChange={(e) => setConfig({
            ...config,
            aliyun: { ...config.aliyun!, folder: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  )

  const renderTencentConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Region
        </label>
        <input
          type="text"
          placeholder="ap-guangzhou"
          value={config.tencent?.region || ''}
          onChange={(e) => setConfig({
            ...config,
            tencent: { ...config.tencent!, region: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bucket
        </label>
        <input
          type="text"
          placeholder="your-bucket-name"
          value={config.tencent?.bucket || ''}
          onChange={(e) => setConfig({
            ...config,
            tencent: { ...config.tencent!, bucket: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SecretId
        </label>
        <input
          type="text"
          placeholder="SecretId"
          value={config.tencent?.secretId || ''}
          onChange={(e) => setConfig({
            ...config,
            tencent: { ...config.tencent!, secretId: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SecretKey
        </label>
        <input
          type="password"
          placeholder="SecretKey"
          value={config.tencent?.secretKey || ''}
          onChange={(e) => setConfig({
            ...config,
            tencent: { ...config.tencent!, secretKey: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          存储文件夹
        </label>
        <input
          type="text"
          placeholder="multipub"
          value={config.tencent?.folder || ''}
          onChange={(e) => setConfig({
            ...config,
            tencent: { ...config.tencent!, folder: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  )

  const renderCustomConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          上传接口 URL
        </label>
        <input
          type="url"
          placeholder="https://your-server.com/upload"
          value={config.custom?.uploadUrl || ''}
          onChange={(e) => setConfig({
            ...config,
            custom: { ...config.custom!, uploadUrl: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          响应格式
        </label>
        <select
          value={config.custom?.responseFormat || 'url'}
          onChange={(e) => setConfig({
            ...config,
            custom: { 
              ...config.custom!, 
              responseFormat: e.target.value as 'url' | 'json' 
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="url">直接返回 URL</option>
          <option value="json">JSON 格式</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">图床配置</h3>
      
      {/* 提供商选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择图床服务商
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setConfig({ ...config, provider: provider.id as any })}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                config.provider === provider.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{provider.icon}</span>
              <span className="text-sm font-medium">{provider.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 配置表单 */}
      <div className="mb-6">
        {config.provider === 'aliyun' && renderAliyunConfig()}
        {config.provider === 'tencent' && renderTencentConfig()}
        {config.provider === 'custom' && renderCustomConfig()}
      </div>

      {/* 保存按钮 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          保存配置
        </button>
        
        {saved && (
          <span className="text-green-600 text-sm">✓ 已保存</span>
        )}
      </div>

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">使用说明</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• 拖拽图片到编辑器区域即可上传</li>
          <li>• 支持 Ctrl+V 粘贴图片</li>
          <li>• 图片会自动压缩到 1MB 以下</li>
          <li>• 上传成功后自动插入 Markdown 图片语法</li>
        </ul>
      </div>
    </div>
  )
}