# MultiPub Chrome 扩展

将 Markdown 内容一键注入公众号编辑器。

## 安装步骤

### 1. 准备图标

在 `icons/` 目录下放置以下尺寸的图标：
- `icon16.png` - 16x16
- `icon48.png` - 48x48
- `icon128.png` - 128x128

可以使用任意图标生成工具，或使用以下占位图标命令（需要 ImageMagick）：

```bash
cd extension/icons

# 生成简单占位图标（红色背景 + 白色 M）
convert -size 16x16 xc:'#667eea' -gravity center -pointsize 10 -fill white -annotate 0 'M' icon16.png
convert -size 48x48 xc:'#667eea' -gravity center -pointsize 30 -fill white -annotate 0 'M' icon48.png
convert -size 128x128 xc:'#667eea' -gravity center -pointsize 80 -fill white -annotate 0 'M' icon128.png
```

或使用在线工具如 https://favicon.io/ 生成。

### 2. 加载扩展

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `extension` 目录

### 3. 获取扩展 ID

加载成功后，在扩展卡片上可以看到扩展 ID（类似 `abcdefghijklmnopqrstuvwxyz123456`）。

记录这个 ID，后续需要配置到 MultiPub Web 端。

## 使用方法

1. 在 MultiPub Web 编辑器中编写 Markdown
2. 点击「发送到扩展」按钮
3. 打开公众号编辑器页面 (mp.weixin.qq.com)
4. 点击右下角的 📝 按钮注入内容

## 目录结构

```
extension/
├── manifest.json       # 扩展配置
├── background.js       # Service Worker（消息处理）
├── content.js          # 注入脚本（公众号页面）
├── popup/
│   ├── popup.html      # 弹窗 UI
│   ├── popup.css       # 弹窗样式
│   └── popup.js        # 弹窗逻辑
├── icons/              # 扩展图标
└── README.md           # 本文档
```

## 开发调试

### 查看日志

- **Background 日志**: `chrome://extensions/` → MultiPub → 「service worker」链接
- **Content Script 日志**: 公众号页面 → F12 开发者工具 → Console
- **Popup 日志**: 右键扩展图标弹窗 → 检查

### 重新加载扩展

修改代码后，在 `chrome://extensions/` 点击扩展卡片上的刷新按钮。

## 注意事项

1. **安全限制**: 扩展只能在公众号后台页面 (mp.weixin.qq.com) 注入内容
2. **内容过期**: 存储的内容 24 小时后自动过期
3. **图片处理**: 当前版本暂不支持自动上传图片，需手动处理

## 后续优化

- [ ] 支持图片自动上传
- [ ] 添加快捷键支持
- [ ] 支持多个内容槽位
- [ ] 发布到 Chrome 商店

---

**版本**: 1.0.0
**开发者**: 归零工作室
