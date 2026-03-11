'use client'

import { useMemo, useCallback, useState } from 'react'
import { renderMarkdown } from '@/lib/markdown/renderer'
import type { ThemeStyles } from '@/lib/markdown/renderer'
import { getPlatformConfig } from '@/lib/platforms'

// Chrome 扩展 ID（需要替换为实际安装后的 ID）
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || ''

interface PreviewProps {
  markdown: string
  theme: ThemeStyles
  previewRef?: React.RefObject<HTMLDivElement>
  platform?: string // 平台 ID
  onCopySuccess?: (message: string) => void
}

export default function Preview({ markdown, theme, previewRef, platform = 'wechat', onCopySuccess }: PreviewProps) {
  const [extensionStatus, setExtensionStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const platformConfig = getPlatformConfig(platform)
  
  const html = useMemo(() => {
    if (!markdown.trim()) return ''
    try {
      let rendered = renderMarkdown(markdown, { theme, citeStatus: true, platform })
      
      // 应用平台特定的后处理
      if (platformConfig.postprocess) {
        rendered = platformConfig.postprocess(rendered)
      }
      
      return rendered
    } catch (e) {
      console.error('Render error:', e)
      return '<p style="color: red;">渲染错误</p>'
    }
  }, [markdown, theme, platform, platformConfig])

  const handleCopy = useCallback(async () => {
    if (!previewRef?.current) return

    try {
      // 复制带样式的 HTML（可直接粘贴）
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(previewRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)

      // 使用 Clipboard API 复制富文本
      const htmlContent = previewRef.current.innerHTML
      const blob = new Blob([htmlContent], { type: 'text/html' })
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([markdown], { type: 'text/plain' }),
        }),
      ])

      selection?.removeAllRanges()
      
      // 使用回调通知父组件，如果没有回调则使用 alert
      if (onCopySuccess) {
        onCopySuccess(platformConfig.copySuccessMessage)
      } else {
        alert(`✅ ${platformConfig.copySuccessMessage}`)
      }
    } catch {
      // 降级方案：选中文本
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(previewRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)
      document.execCommand('copy')
      
      if (onCopySuccess) {
        onCopySuccess(platformConfig.copySuccessMessage)
      } else {
        alert(`✅ ${platformConfig.copySuccessMessage}`)
      }
    }
  }, [markdown, previewRef, platformConfig, onCopySuccess])

  // 根据平台生成按钮文案
  const copyButtonText = platform === 'wechat' 
    ? '📋 复制到公众号' 
    : `📋 复制到${platformConfig.name}`

  // 发送内容到 Chrome 扩展
  const handleSendToExtension = useCallback(async () => {
    if (!previewRef?.current) return
    
    setExtensionStatus('sending')
    
    try {
      // 获取主题名称（从 theme 对象推断）
      const themeName = theme.name || 'default'
      
      // 准备要发送的内容
      const content = {
        type: 'MULTIPUB_CONTENT',
        html: previewRef.current.innerHTML,
        theme: themeName
      }
      
      // 检查是否有扩展 ID
      if (!EXTENSION_ID) {
        // 尝试使用 chrome.runtime（如果扩展已安装且配置了 externally_connectable）
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          // 发送到任意扩展（需要 externally_connectable 配置）
          chrome.runtime.sendMessage(content, (response) => {
            if (chrome.runtime.lastError) {
              console.error('[MultiPub] Extension error:', chrome.runtime.lastError)
              setExtensionStatus('error')
              onCopySuccess?.('❌ 扩展未安装或未正确配置')
              return
            }
            
            if (response?.success) {
              setExtensionStatus('success')
              onCopySuccess?.('✅ 已发送到扩展，请打开公众号编辑器')
              setTimeout(() => setExtensionStatus('idle'), 3000)
            } else {
              setExtensionStatus('error')
              onCopySuccess?.('❌ 发送失败: ' + (response?.message || '未知错误'))
            }
          })
        } else {
          setExtensionStatus('error')
          onCopySuccess?.('❌ Chrome 扩展未安装')
          return
        }
      } else {
        // 使用指定的扩展 ID 发送消息
        chrome.runtime.sendMessage(EXTENSION_ID, content, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[MultiPub] Extension error:', chrome.runtime.lastError)
            setExtensionStatus('error')
            onCopySuccess?.('❌ 扩展未安装或未正确配置')
            return
          }
          
          if (response?.success) {
            setExtensionStatus('success')
            onCopySuccess?.('✅ 已发送到扩展，请打开公众号编辑器')
            setTimeout(() => setExtensionStatus('idle'), 3000)
          } else {
            setExtensionStatus('error')
            onCopySuccess?.('❌ 发送失败: ' + (response?.message || '未知错误'))
          }
        })
      }
    } catch (error) {
      console.error('[MultiPub] Send to extension error:', error)
      setExtensionStatus('error')
      onCopySuccess?.('❌ 发送失败')
    }
  }, [previewRef, theme, onCopySuccess])

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">👁️ 预览效果</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendToExtension}
            disabled={extensionStatus === 'sending'}
            className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${
              extensionStatus === 'success'
                ? 'bg-green-500 text-white'
                : extensionStatus === 'error'
                ? 'bg-red-500 text-white'
                : extensionStatus === 'sending'
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
            title="发送到 Chrome 扩展"
          >
            {extensionStatus === 'sending' && '⏳ 发送中...'}
            {extensionStatus === 'success' && '✅ 已发送'}
            {extensionStatus === 'error' && '❌ 重试'}
            {extensionStatus === 'idle' && '🚀 发送到扩展'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
            title={`复制${platformConfig.name} (Ctrl+Shift+C)`}
          >
            {copyButtonText}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-white">
        <div
          ref={previewRef}
          className="max-w-[600px] mx-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
