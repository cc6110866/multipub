'use client'

import { useMemo, useCallback, RefObject } from 'react'
import { renderMarkdown } from '@/lib/markdown/renderer'
import type { ThemeStyles } from '@/lib/markdown/renderer'
import { getPlatformConfig } from '@/lib/platforms'

interface PreviewProps {
  markdown: string
  theme: ThemeStyles
  previewRef?: RefObject<HTMLDivElement | null>
  platform?: string // 平台 ID
  onCopySuccess?: (message: string) => void
}

export default function Preview({ markdown, theme, previewRef, platform = 'wechat', onCopySuccess }: PreviewProps) {
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

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">👁️ 预览效果</span>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
          title={`复制${platformConfig.name} (Ctrl+Shift+C)`}
        >
          {copyButtonText}
        </button>
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
