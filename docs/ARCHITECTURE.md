# MultiPub 架构设计文档

## 系统概述

MultiPub 是一个 Markdown 转公众号格式的工具，核心功能是将 Markdown 文本转换为带有样式的 HTML，支持一键复制到公众号编辑器。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户界面                              │
│  ┌──────────────────┐     ┌──────────────────┐              │
│  │     Editor       │     │     Preview      │              │
│  │  (Markdown输入)   │────▶│   (HTML预览)     │              │
│  └──────────────────┘     └──────────────────┘              │
│           │                        │                         │
│           │    ┌───────────────────┘                         │
│           │    │                                               │
│           ▼    ▼                                               │
│  ┌──────────────────────────────────────┐                    │
│  │          ThemeSelector               │                    │
│  │         (主题切换)                     │                    │
│  └──────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         核心层                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Markdown Renderer                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   marked    │  │  highlight  │  │   Theme     │  │   │
│  │  │   Parser    │──│    .js      │──│   Styles    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         输出层                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Clipboard API                            │   │
│  │   text/html + text/plain → 公众号编辑器               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 核心模块

### 1. 编辑器 (Editor.tsx)

**职责**: 接收用户输入的 Markdown 文本

```typescript
interface EditorProps {
  value: string          // Markdown 内容
  onChange: (value: string) => void  // 内容变更回调
}
```

**当前实现**: 基础 textarea
**未来优化**: CodeMirror 6 集成（已有依赖 @uiw/react-codemirror）

### 2. 预览面板 (Preview.tsx)

**职责**: 渲染 Markdown 为带样式的 HTML

```typescript
interface PreviewProps {
  markdown: string       // Markdown 内容
  theme: ThemeStyles     // 主题样式对象
}
```

**核心功能**:
- 调用 `renderMarkdown()` 渲染 HTML
- 提供一键复制功能（Clipboard API）
- 降级方案：`document.execCommand('copy')`

### 3. 主题选择器 (ThemeSelector.tsx)

**职责**: 切换主题样式

```typescript
interface ThemeSelectorProps {
  currentTheme: string                    // 当前主题 ID
  onThemeChange: (themeId: string) => void // 主题切换回调
}
```

### 4. Markdown 渲染器 (renderer.ts)

**职责**: 将 Markdown 转换为带 inline style 的 HTML

**核心接口**:

```typescript
interface ThemeStyles {
  base: Record<string, string>      // 基础样式（容器）
  block: Record<string, Record<string, string>>  // 块级元素样式
  inline: Record<string, Record<string, string>> // 行内元素样式
}

interface RendererOptions {
  theme: ThemeStyles     // 主题样式
  citeStatus?: boolean   // 是否生成引用脚注
  showLineNumber?: boolean // 是否显示行号（未实现）
}

function renderMarkdown(md: string, options: RendererOptions): string
```

**支持的元素**:

| 类型 | 元素 | 说明 |
|------|------|------|
| 块级 | h1-h4 | 标题 |
| 块级 | p | 段落 |
| 块级 | blockquote | 引用块 |
| 块级 | pre/code | 代码块（带高亮） |
| 块级 | ul/ol | 列表 |
| 块级 | table | 表格 |
| 块级 | hr | 分隔线 |
| 块级 | figure/img | 图片 |
| 行内 | codespan | 行内代码 |
| 行内 | strong | 加粗 |
| 行内 | em | 斜体 |
| 行内 | a | 链接（带脚注） |

### 5. 主题系统 (themes/index.ts)

**职责**: 定义和管理主题样式

**主题结构**:

```typescript
const themes: Record<string, { name: string; theme: ThemeStyles }> = {
  default: { name: '默认简洁', theme: defaultTheme },
  tech: { name: '科技蓝', theme: techTheme },
  warm: { name: '暖色柔和', theme: warmTheme },
  green: { name: '清新绿', theme: greenTheme },
  purple: { name: '优雅紫', theme: purpleTheme },
}
```

## 数据流

```
用户输入 Markdown
       │
       ▼
  Editor.onChange()
       │
       ▼
  page.tsx: setMarkdown()
       │
       ├──────────────────┐
       ▼                  ▼
  Editor (value)     Preview (markdown + theme)
                           │
                           ▼
                    renderMarkdown()
                           │
                           ▼
                      HTML 输出
                           │
                           ▼
                    用户点击复制
                           │
                           ▼
                    Clipboard API
                           │
                           ▼
                    粘贴到公众号
```

## 复制机制

### 主方案: Clipboard API

```typescript
const htmlContent = previewRef.current.innerHTML
const blob = new Blob([htmlContent], { type: 'text/html' })
await navigator.clipboard.write([
  new ClipboardItem({
    'text/html': blob,
    'text/plain': new Blob([markdown], { type: 'text/plain' }),
  }),
])
```

### 降级方案: execCommand

```typescript
const selection = window.getSelection()
const range = document.createRange()
range.selectNodeContents(previewRef.current)
selection?.removeAllRanges()
selection?.addRange(range)
document.execCommand('copy')
```

## 样式策略

### 为什么使用 inline style？

公众号编辑器不支持外部 CSS，所有样式必须内联。

**转换示例**:

```typescript
function styleToString(style: Record<string, string>): string {
  return Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}
```

## 代码高亮

使用 highlight.js 进行语法高亮，已注册语言：

- JavaScript / TypeScript
- Python
- CSS / HTML / XML
- Bash / Shell
- JSON / YAML
- SQL
- Java / Go / Rust
- Markdown

## 依赖关系

```
page.tsx
  ├── Editor.tsx
  ├── Preview.tsx
  │   └── renderer.ts
  │       └── highlight.js
  └── ThemeSelector.tsx
      └── themes/index.ts
```

## 扩展点

### 1. 添加新主题

编辑 `src/lib/themes/index.ts`，添加新主题对象。

### 2. 添加新语言高亮

编辑 `src/lib/markdown/renderer.ts`，注册新语言：

```typescript
import kotlin from 'highlight.js/lib/languages/kotlin'
hljs.registerLanguage('kotlin', kotlin)
```

### 3. 自定义渲染器

扩展 `renderer.ts` 中的 `RendererObject`，添加新的元素处理逻辑。

## 性能考虑

1. **useMemo** - HTML 渲染结果缓存
2. **useCallback** - 复制函数缓存
3. **防抖** - Phase 2 可添加输入防抖

## 安全考虑

1. **XSS 防护** - `escapeHtml()` 函数转义危险字符
2. **dangerouslySetInnerHTML** - 仅用于渲染器输出，不直接接受用户输入

---

*文档版本: 2026-02-28*
*作者: 大狸（开发工程师）*
