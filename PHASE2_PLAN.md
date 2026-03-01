# MultiPub Phase 2 - Chrome 扩展方案

## 方案对比

| 对比项 | API 推送 | Chrome 扩展 |
|--------|----------|-------------|
| 权限要求 | 需要公众号 API 权限 | 无需任何权限 |
| 适用账号 | 服务号/认证号 | 所有账号（含个人订阅号） |
| 实现复杂度 | 高（OAuth、API 对接） | 中（DOM 操作） |
| 用户体验 | 需要配置 AppID/Secret | 一键注入 |

## 功能设计

### 核心功能
1. **一键注入** - 在公众号编辑器页面注入格式化内容
2. **样式同步** - 保持 MultiPub 主题样式
3. **图片处理** - 自动上传图片到公众号图床

### 扩展功能（可选）
- 保存草稿到本地
- 历史记录管理
- 快捷键支持

## 技术方案

### 1. Chrome 扩展结构
```
multipub-extension/
├── manifest.json          # 扩展配置（Manifest V3）
├── background.js          # Service Worker
├── content.js             # 注入公众号页面的脚本
├── popup/                 # 扩展弹窗
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/                 # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── lib/                   # 工具库
    └── injector.js        # DOM 注入逻辑
```

### 2. 工作流程

```
用户操作流程：
1. 在 MultiPub Web 编辑器中编辑 Markdown
2. 选择主题，预览效果
3. 点击"发送到 Chrome 扩展"按钮
4. 扩展接收内容，存储到 chrome.storage
5. 用户打开公众号编辑器（mp.weixin.qq.com）
6. 扩展检测到公众号页面，自动注入内容
7. 用户可在公众号编辑器中继续调整
```

### 3. 通信机制

```
MultiPub Web <---> Chrome Extension <---> 公众号编辑器
     │                    │                    │
     │  chrome.runtime.sendMessage()          │
     │ ──────────────────>│                    │
     │                    │  DOM 操作           │
     │                    │ ──────────────────>│
```

### 4. 公众号编辑器注入点

```javascript
// 公众号编辑器主要 DOM 结构
<div id="edui1_iframeholder">  // 编辑器 iframe
  <iframe id="edui1_iframe">
    <body contenteditable="true">
      <!-- 注入内容到这里 -->
    </body>
  </iframe>
</div>

// 备用注入点
<div class="rich_media_content">  // 预览区域
```

## 开发计划

### Week 1：基础框架
- [ ] 创建 Chrome 扩展项目结构
- [ ] 实现 manifest.json（Manifest V3）
- [ ] 开发 popup 弹窗 UI
- [ ] 实现 chrome.storage 存储

### Week 2：通信与注入
- [ ] MultiPub Web 添加"发送到扩展"按钮
- [ ] 实现 Web <-> Extension 消息通信
- [ ] 开发 content.js 注入逻辑
- [ ] 测试公众号编辑器注入

### Week 3：样式与优化
- [ ] 样式转换（CSS -> inline style）
- [ ] 代码块样式适配
- [ ] 图片处理方案
- [ ] 错误处理与用户提示

## 技术细节

### Manifest V3 配置
```json
{
  "manifest_version": 3,
  "name": "MultiPub - 公众号排版助手",
  "version": "1.0.0",
  "description": "将 Markdown 内容一键注入公众号编辑器",
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://mp.weixin.qq.com/*"
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["https://mp.weixin.qq.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

### 外部通信（Web -> Extension）
```javascript
// MultiPub Web 端
const EXTENSION_ID = 'chrome-extension://xxxxxxxxxxxx'

function sendToExtension(content) {
  chrome.runtime.sendMessage(EXTENSION_ID, {
    type: 'MULTIPUB_CONTENT',
    html: content.html,
    theme: content.theme
  }, (response) => {
    if (response?.success) {
      showToast('已发送到扩展，请打开公众号编辑器')
    }
  })
}
```

## 风险与对策

| 风险 | 对策 |
|------|------|
| 公众号 DOM 结构变化 | 多个注入点兜底 + 定期维护 |
| 扩展审核 | 先用开发者模式测试，后续上架 Chrome 商店 |
| 图片上传 | 使用公众号自带上传功能，或提示用户手动上传 |

## 交付物

1. Chrome 扩展源码（`multipub-extension/`）
2. MultiPub Web 集成代码更新
3. 安装使用文档
4. 测试报告

---

**开始时间**: 2026-02-25
**预计完成**: 2026-03-10（2 周）
