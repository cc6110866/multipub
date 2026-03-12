'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Editor from '@/components/Editor'
import Preview from '@/components/Preview'
import ThemeSelector from '@/components/ThemeSelector'
import PlatformSelector from '@/components/PlatformSelector'
import { themes } from '@/lib/themes'
import { getDefaultPlatform } from '@/lib/platforms'

const defaultMarkdown = `# MultiPub - 多平台内容发布

> 将 Markdown 文章一键转换为公众号格式，告别繁琐排版。

## ✨ 功能特性

- **Markdown 编辑**：支持完整的 Markdown 语法
- **样式模板**：多种精美主题一键切换
- **代码高亮**：自动识别编程语言
- **一键复制**：直接粘贴到公众号编辑器

## 📝 使用方法

1. 在左侧编辑器输入 Markdown 内容
2. 选择喜欢的样式主题
3. 点击"复制到公众号"按钮
4. 前往公众号后台粘贴即可

## 💻 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, MultiPub!')
  return { success: true }
}
\`\`\`

## 📊 功能对比

| 功能 | MultiPub | 传统方式 |
|------|---------|---------|
| Markdown 支持 | ✅ | ❌ |
| 样式模板 | ✅ | ❌ |
| 一键复制 | ✅ | ❌ |
| 代码高亮 | ✅ | ❌ |

---

> 💡 **提示**：选择不同主题，预览效果会实时变化。

更多信息请访问 [GitHub](https://github.com) 了解详情。
`

// 计算字数（中文按字，英文按词）
function countWords(text: string): number {
  // 移除 Markdown 标记
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/[#*_~>`\[\]()!|-]/g, '') // 移除 Markdown 符号
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/\s+/g, ' ') // 合并空白
    .trim()

  if (!cleanText) return 0

  // 分离中英文
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || []
  const englishText = cleanText.replace(/[\u4e00-\u9fa5]/g, ' ')
  
  // 英文按词计算
  const englishWords = englishText
    .split(/\s+/)
    .filter(word => word.length > 0)
  
  return chineseChars.length + englishWords.length
}

// 计算段落数
function countParagraphs(text: string): number {
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0)
  return paragraphs.length
}

// 计算阅读时间（按 300 字/分钟计算）
function calculateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 300)
  if (minutes < 1) return '不到 1 分钟'
  return `${minutes} 分钟`
}

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [currentThemeId, setCurrentThemeId] = useState('default')
  const [currentPlatform, setCurrentPlatform] = useState(getDefaultPlatform())
  const [saveStatus, setSaveStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const currentTheme = themes[currentThemeId]?.theme || themes.default.theme

  // 字数统计
  const charCount = markdown.length
  const wordCount = countWords(markdown)
  const paragraphCount = countParagraphs(markdown)
  const readingTime = calculateReadingTime(wordCount)

  // 从本地存储加载
  useEffect(() => {
    const saved = localStorage.getItem('multipub-markdown')
    if (saved) {
      setMarkdown(saved)
    }
  }, [])

  // 保存到本地存储
  const handleSave = useCallback(() => {
    localStorage.setItem('multipub-markdown', markdown)
    setSaveStatus('✅ 已保存')
    setTimeout(() => setSaveStatus(''), 2000)
  }, [markdown])

  // 复制成功回调
  const handleCopySuccess = useCallback((message: string) => {
    setSaveStatus(`📋 ${message}`)
    setTimeout(() => setSaveStatus(''), 3000)
  }, [])

  // 复制到公众号
  const handleCopy = useCallback(async () => {
    if (!previewRef.current) return

    try {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(previewRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)

      const htmlContent = previewRef.current.innerHTML
      const blob = new Blob([htmlContent], { type: 'text/html' })
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([markdown], { type: 'text/plain' }),
        }),
      ])

      selection?.removeAllRanges()
      setSaveStatus('📋 已复制到剪贴板')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(previewRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)
      document.execCommand('copy')
      setSaveStatus('📋 已复制到剪贴板')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }, [markdown])

  // 打开文件
  const handleOpen = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // 导入 Markdown 文件
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setMarkdown(content)
      setSaveStatus('📂 已导入文件')
      setTimeout(() => setSaveStatus(''), 2000)
    }
    reader.readAsText(file)
    
    // 重置 input 以允许重复选择同一文件
    e.target.value = ''
  }, [])

  // 导出 Markdown 文件
  const handleExport = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${new Date().toISOString().slice(0, 10)}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setSaveStatus('💾 已导出文件')
    setTimeout(() => setSaveStatus(''), 2000)
  }, [markdown])

  // 全局快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S - 保存
      if (e.ctrlKey && e.key === 's' && !e.shiftKey) {
        e.preventDefault()
        handleSave()
      }
      // Ctrl+Shift+C - 复制到公众号
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
      // Ctrl+O - 打开文件
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault()
        handleOpen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleCopy, handleOpen])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800">
            ✍️ MultiPub
          </h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            多平台内容发布
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* 导入导出按钮 */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={handleOpen}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1"
              title="导入 Markdown 文件 (Ctrl+O)"
            >
              📂 导入
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1"
              title="导出 Markdown 文件"
            >
              💾 导出
            </button>
          </div>
          {/* 平台选择器 */}
          <PlatformSelector
            currentPlatform={currentPlatform}
            onPlatformChange={setCurrentPlatform}
          />
          {/* 主题选择器 */}
          <ThemeSelector
            currentTheme={currentThemeId}
            onThemeChange={setCurrentThemeId}
          />
          {saveStatus && (
            <span className="text-sm text-green-600 animate-pulse">
              {saveStatus}
            </span>
          )}
        </div>
      </header>

      {/* 主体区域 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧编辑器 */}
        <div className="w-1/2 border-r border-gray-200">
          <Editor 
            value={markdown} 
            onChange={setMarkdown}
            onSave={handleSave}
            onCopy={handleCopy}
            onOpen={handleOpen}
          />
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2">
          <Preview 
            markdown={markdown} 
            theme={currentTheme}
            themeId={currentThemeId}
            previewRef={previewRef}
            platform={currentPlatform}
            onCopySuccess={handleCopySuccess}
          />
        </div>
      </main>

      {/* 底部状态栏 */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-6">
          <span title="字符数">📊 字符：{charCount.toLocaleString()}</span>
          <span title="字数（中文按字，英文按词）">📝 字数：{wordCount.toLocaleString()}</span>
          <span title="段落数">📄 段落：{paragraphCount}</span>
          <span title="预计阅读时间（按 300 字/分钟计算）">⏱️ 阅读：{readingTime}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">快捷键：Ctrl+S 保存 · Ctrl+Shift+C 复制 · Ctrl+O 打开</span>
          <span className="text-gray-400">MultiPub v0.2.0</span>
        </div>
      </footer>
    </div>
  )
}
