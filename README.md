# MultiPub - 多平台内容发布系统

> 将 Markdown 一键转换为公众号格式，告别繁琐排版。

## ✨ 功能特性

- **Markdown 编辑** - 支持完整 Markdown 语法
- **样式模板** - 5 套精美主题一键切换
- **代码高亮** - 支持 12+ 编程语言
- **一键复制** - 直接粘贴到公众号编辑器
- **引用脚注** - 自动生成链接引用列表

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

## 📖 使用方法

1. 在左侧编辑器输入 Markdown 内容
2. 选择喜欢的样式主题
3. 点击「复制到公众号」按钮
4. 前往公众号后台直接粘贴

## 🎨 主题列表

| 主题 | 说明 |
|------|------|
| 默认简洁 | 简洁大方，适合技术文章 |
| 科技蓝 | 深色配色，科技感强 |
| 暖色柔和 | 温暖柔和，适合生活类文章 |
| 清新绿 | 清新自然，适合教程类文章 |
| 优雅紫 | 优雅高贵，适合设计类文章 |

## 📁 项目结构

```
multipub/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/             # React 组件
│   │   ├── Editor.tsx          # Markdown 编辑器
│   │   ├── Preview.tsx         # 预览面板
│   │   └── ThemeSelector.tsx   # 主题选择器
│   └── lib/                    # 核心库
│       ├── markdown/
│       │   └── renderer.ts     # Markdown 渲染器
│       └── themes/
│           └── index.ts        # 主题定义
├── public/                     # 静态资源
├── package.json
└── tsconfig.json
```

## 🛠 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **Markdown**: marked + highlight.js
- **状态**: React useState（Phase 2 将使用 Zustand）

## 📋 开发计划

### Phase 1: 编辑器 + 样式转换 ✅ 已完成
- [x] Markdown 编辑器
- [x] 实时预览
- [x] 5 套主题样式
- [x] 一键复制功能

### Phase 2: Chrome 扩展 🔄 进行中
- [ ] Chrome 扩展开发
- [ ] 自动注入公众号编辑器
- [ ] 图片上传处理

### Phase 3: 多平台扩展 📋 计划中
- [ ] 知乎专栏支持
- [ ] 小红书支持
- [ ] 掘金支持

## 🔗 相关文档

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 项目架构设计
- [THEME_DEVELOPMENT.md](./docs/THEME_DEVELOPMENT.md) - 主题开发指南
- [PHASE2_PLAN.md](./PHASE2_PLAN.md) - Chrome 扩展方案

## 📄 License

MIT

---

**开发团队**: 归零工作室
**当前版本**: v0.1.0 (Phase 1)
