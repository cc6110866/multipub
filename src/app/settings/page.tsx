// src/app/settings/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import StorageConfig from '@/components/StorageConfig'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'storage' | 'about'>('storage')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← 返回编辑器
            </Link>
            <h1 className="text-xl font-bold text-gray-900">设置</h1>
          </div>
        </div>
      </header>

      {/* 标签页 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'storage'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            图床配置
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'about'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            关于
          </button>
        </div>

        {/* 内容区域 */}
        {activeTab === 'storage' && (
          <div>
            <StorageConfig />
            
            {/* 已上传图片列表 */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">已上传图片</h3>
              <p className="text-sm text-gray-500">最近上传的图片将显示在这里</p>
              <p className="text-xs text-gray-400 mt-2">* 图片记录保存在浏览器本地</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">关于 MultiPub</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>MultiPub 是一个多平台 Markdown 编辑器，支持一键复制到微信公众号等平台。</p>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">主要功能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Markdown 编辑器</li>
                  <li>多平台样式预览</li>
                  <li>一键复制（支持格式化）</li>
                  <li>图片上传到图床</li>
                  <li>主题切换</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">版本</h4>
                <p>Phase 2 - 图片上传功能</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
