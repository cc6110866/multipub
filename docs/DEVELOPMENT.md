# MultiPub 开发指南

## 环境要求

- Node.js >= 18.0
- npm >= 9.0

## 本地开发

### 安装依赖

```bash
cd projects/multipub
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建检查

```bash
npm run build
```

### 类型检查

```bash
npm run typecheck
```

### 代码检查

```bash
npm run lint
```

## 项目文件结构

```
multipub/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局（字体、元数据）
│   │   └── page.tsx            # 主页面（编辑器+预览布局）
│   ├── components/
│   │   ├── Editor.tsx          # Markdown 编辑器
│   │   ├── Preview.tsx         # HTML 预览面板 + 复制功能
│   │   └── ThemeSelector.tsx   # 主题选择器
│   └── lib/
│       ├── markdown/
│       │   └── renderer.ts     # Markdown 渲染器（核心）
│       └── themes/
│           └── index.ts        # 主题定义（5套主题）
├── docs/
│   ├── ARCHITECTURE.md         # 架构设计文档
│   └── THEME_DEVELOPMENT.md    # 主题开发指南
├── public/                     # 静态资源
├── package.json
├── tsconfig.json
├── next.config.ts
├── README.md                   # 项目说明
└── PHASE2_PLAN.md              # Phase 2 开发计划
```

## 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| next | 15.2.4 | 框架 |
| react | 19.0.0 | UI |
| marked | 15.0.11 | Markdown 解析 |
| highlight.js | 11.11.0 | 代码高亮 |
| tailwindcss | 4.0.2 | 样式 |

## 开发规范

### 代码风格

- 使用 TypeScript
- 使用函数组件 + Hooks
- 使用 Tailwind CSS
- 组件使用 `'use client'` 指令

### 命名规范

- 组件：PascalCase（如 `Editor.tsx`）
- 函数：camelCase（如 `renderMarkdown`）
- 常量：camelCase（如 `defaultTheme`）
- 类型：PascalCase（如 `ThemeStyles`）

### 文件组织

- 一个文件一个组件
- 类型定义放在文件顶部或单独的 `.d.ts` 文件
- 相关功能放在同一目录

## 常见开发任务

### 添加新的 Markdown 元素支持

1. 在 `renderer.ts` 中添加新的渲染方法
2. 定义对应的样式接口
3. 在主题文件中添加默认样式

示例：添加任务列表支持

```typescript
// renderer.ts
checkbox({ checked }: Tokens.Checkbox): string {
  const icon = checked ? '✅' : '⬜'
  return `<span>${icon}</span>`
}
```

### 添加新的主题

1. 在 `themes/index.ts` 中定义新主题
2. 添加到 `themes` 对象
3. 在 `ThemeSelector.tsx` 中添加颜色标识

### 修改复制行为

编辑 `Preview.tsx` 中的 `handleCopy` 函数。

## 调试技巧

### 查看 HTML 输出

```typescript
// 在 Preview.tsx 中添加
console.log(html)
```

### 检查主题样式

```typescript
// 在 renderer.ts 中添加
console.log(styleToString(theme.block.h1))
```

### 测试特定 Markdown

修改 `page.tsx` 中的 `defaultMarkdown` 常量。

## 性能优化

### 当前优化

- `useMemo` 缓存 HTML 渲染结果
- `useCallback` 缓存事件处理函数

### 可选优化

- 添加输入防抖（如 300ms）
- 使用 Web Worker 处理大型文档
- 虚拟滚动（超长文档）

## 已知限制

1. **编辑器**: 当前使用基础 textarea，Phase 2 可升级到 CodeMirror
2. **图片**: 无法自动上传到公众号图床，需手动处理
3. **表格**: 复杂表格可能显示异常
4. **公式**: 不支持 LaTeX 数学公式

## Git 工作流

```bash
# 创建功能分支
git checkout -b feature/new-theme

# 提交更改
git add .
git commit -m "feat: 添加新主题 xxx"

# 推送到远程
git push origin feature/new-theme
```

### Commit 规范

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 发布检查清单

- [ ] 运行 `npm run typecheck` 无错误
- [ ] 运行 `npm run lint` 无警告
- [ ] 运行 `npm run build` 成功
- [ ] 本地测试所有主题
- [ ] 测试复制到公众号功能
- [ ] 更新 README.md 版本号
- [ ] 更新 CHANGELOG（如有）

## 联系方式

- 开发者: 大狸（开发工程师）
- 团队: 归零工作室

---

*文档版本: 2026-02-28*
