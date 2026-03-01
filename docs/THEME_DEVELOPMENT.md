# MultiPub 主题开发指南

## 主题结构

每个主题由三部分样式组成：

```typescript
interface ThemeStyles {
  base: Record<string, string>      // 容器基础样式
  block: Record<string, Record<string, string>>  // 块级元素
  inline: Record<string, Record<string, string>> // 行内元素
}
```

## 快速开始

### 1. 创建新主题

编辑 `src/lib/themes/index.ts`：

```typescript
// 1. 定义主题样式
export const myTheme: ThemeStyles = {
  base: {
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.75',
    fontFamily: '-apple-system, sans-serif',
    padding: '10px',
  },
  block: {
    h1: { fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' },
    h2: { fontSize: '19px', fontWeight: 'bold', color: '#1a1a1a' },
    // ... 其他块级元素
  },
  inline: {
    codespan: { background: '#f5f5f5', color: '#c7254e' },
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
    link: { color: '#2196F3' },
  },
}

// 2. 添加到主题列表
export const themes: Record<string, { name: string; theme: ThemeStyles }> = {
  // ... 已有主题
  mytheme: { name: '我的主题', theme: myTheme },
}
```

### 2. 添加主题颜色标识

编辑 `src/components/ThemeSelector.tsx`：

```typescript
const themeColors: Record<string, string> = {
  // ... 已有颜色
  mytheme: '#ff6b6b',  // 添加你的主题色
}
```

## 样式参考

### 块级元素 (block)

| 元素 | 说明 | 常用样式 |
|------|------|----------|
| `h1` | 一级标题 | fontSize, color, textAlign, margin |
| `h2` | 二级标题 | fontSize, color, borderBottom, margin |
| `h3` | 三级标题 | fontSize, color, margin |
| `h4` | 四级标题 | fontSize, color, margin |
| `p` | 段落 | fontSize, lineHeight, color, margin |
| `blockquote` | 引用块 | borderLeft, padding, background, color |
| `pre` | 代码块容器 | background, borderRadius, margin |
| `code` | 代码块内容 | padding, fontSize, color, lineHeight |
| `ul` | 无序列表 | paddingLeft, margin, listStyleType |
| `ol` | 有序列表 | paddingLeft, margin, listStyleType |
| `listitem` | 列表项 | fontSize, lineHeight, color, margin |
| `table` | 表格 | width, borderCollapse, margin |
| `th` | 表头单元格 | background, border, padding, fontWeight |
| `td` | 表格单元格 | border, padding |
| `hr` | 分隔线 | border, borderTop, margin |
| `figcaption` | 图片标题 | fontSize, color, marginTop |

### 行内元素 (inline)

| 元素 | 说明 | 常用样式 |
|------|------|----------|
| `codespan` | 行内代码 | background, color, padding, borderRadius |
| `strong` | 加粗 | fontWeight, color |
| `em` | 斜体 | fontStyle |
| `link` | 链接 | color, textDecoration, borderBottom |

## 样式命名规则

使用 **camelCase** 命名（会自动转换为 kebab-case）：

```typescript
{
  fontSize: '15px',      // → font-size: 15px
  lineHeight: '1.75',    // → line-height: 1.75
  borderBottom: '1px solid #eee',  // → border-bottom: ...
}
```

## 主题继承

可以基于现有主题创建变体：

```typescript
import { defaultTheme, type ThemeStyles } from './index'

// 继承默认主题，只修改颜色
export const blueTheme: ThemeStyles = {
  base: { ...defaultTheme.base },
  block: {
    ...defaultTheme.block,
    h1: { ...defaultTheme.block.h1, color: '#0070f3' },
    h2: { ...defaultTheme.block.h2, color: '#0070f3' },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #0070f3',
      background: '#f0f7ff',
    },
  },
  inline: {
    ...defaultTheme.inline,
    link: { color: '#0070f3' },
  },
}
```

## 设计建议

### 1. 颜色体系

建议使用一个主色调 + 2-3 个辅助色：

```
主色调: 用于标题、链接、重点
辅助色1: 用于引用块背景
辅助色2: 用于行内代码背景
中性色: 用于正文、边框
```

### 2. 字号层级

```
h1: 22px
h2: 19px
h3: 17px
h4: 16px
p:  15px
代码: 13px
脚注: 14px
```

### 3. 间距规范

```
标题上边距: 25-30px
标题下边距: 10-15px
段落间距: 10px
引用块间距: 15px
代码块间距: 15px
```

### 4. 行高

```
标题: 1.4
正文: 1.75
代码: 1.6
```

## 测试主题

1. 启动开发服务器：`npm run dev`
2. 打开 http://localhost:3000
3. 选择你的新主题
4. 检查所有元素的渲染效果

### 测试内容建议

使用以下 Markdown 测试所有元素：

```markdown
# 一级标题

## 二级标题

### 三级标题

正文段落，包含 **加粗** 和 *斜体* 以及 `行内代码`。

> 这是一段引用

- 列表项 1
- 列表项 2

1. 有序列表 1
2. 有序列表 2

\`\`\`javascript
const hello = 'world'
console.log(hello)
\`\`\`

| 列1 | 列2 |
|-----|-----|
| A   | B   |

---

[链接文字](https://example.com)
```

## 复制到公众号测试

1. 点击「复制到公众号」按钮
2. 打开公众号后台
3. 新建图文，粘贴内容
4. 检查样式是否正确

### 常见问题

**Q: 样式在公众号中丢失？**
A: 确保所有样式都是 inline style，公众号不支持 class 选择器。

**Q: 代码块样式不生效？**
A: 检查 pre 和 code 的样式是否都设置了。

**Q: 字体不生效？**
A: 公众号只支持系统字体，建议使用 `-apple-system, sans-serif`。

## 最佳实践

1. **简洁为主** - 公众号阅读场景，避免过度装饰
2. **对比度** - 确保文字和背景有足够对比度
3. **一致性** - 同类元素使用相同样式
4. **可读性** - 行高 1.75-2.0，字号 14-16px

## 示例主题

### 查看现有主题

```bash
cat src/lib/themes/index.ts
```

### 推荐配色

| 主题名 | 主色 | 辅助色 | 适用场景 |
|--------|------|--------|----------|
| 默认蓝 | #2196F3 | #f8f9fa | 技术文章 |
| 科技蓝 | #0070f3 | #f0f7ff | 开发教程 |
| 暖色 | #ff9800 | #fff8e1 | 生活随笔 |
| 清新绿 | #4caf50 | #e8f5e9 | 自然环保 |
| 优雅紫 | #9c27b0 | #f3e5f5 | 设计艺术 |
| 活力橙 | #ff5722 | #fff3e0 | 营销文案 |
| 商务灰 | #607d8b | #eceff1 | 商业报告 |

---

*文档版本: 2026-02-28*
*作者: 大狸（开发工程师）*
