// MultiPub Popup Script
// 管理扩展弹窗 UI 和交互

document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const contentSection = document.getElementById('content-section');
  const contentPreview = document.getElementById('content-preview');
  const contentTheme = document.getElementById('content-theme');
  const contentTime = document.getElementById('content-time');
  const btnClear = document.getElementById('btn-clear');
  const btnOpenEditor = document.getElementById('btn-open-editor');

  // 加载存储的内容
  function loadContent() {
    chrome.runtime.sendMessage({ type: 'GET_CONTENT' }, (response) => {
      if (!response?.success) {
        showStatus('❌ 无法读取存储', 'error');
        return;
      }

      const content = response.content;

      if (!content) {
        showStatus('📭 暂无待注入内容', 'warning');
        contentSection.style.display = 'none';
        btnClear.style.display = 'none';
        return;
      }

      // 检查是否过期（24小时）
      const isExpired = Date.now() - content.timestamp > 24 * 60 * 60 * 1000;

      if (isExpired) {
        showStatus('⏰ 内容已过期，请重新发送', 'warning');
        contentSection.style.display = 'none';
        btnClear.style.display = 'block';
        return;
      }

      // 显示内容预览
      showStatus('✅ 有待注入内容', 'success');
      contentSection.style.display = 'block';
      btnClear.style.display = 'block';

      // 预览内容（去除 HTML 标签，截取前100字）
      const textContent = content.html.replace(/<[^>]*>/g, '').substring(0, 100);
      contentPreview.textContent = textContent + (content.html.length > 100 ? '...' : '');

      // 显示元信息
      contentTheme.textContent = `主题: ${content.theme || '默认'}`;
      contentTime.textContent = formatTime(content.timestamp);
    });
  }

  // 显示状态
  function showStatus(text, type = '') {
    statusText.textContent = text;
    statusText.className = 'status-text ' + type;
  }

  // 格式化时间
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;

    return date.toLocaleDateString('zh-CN');
  }

  // 清除内容
  btnClear.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'CLEAR_CONTENT' }, (response) => {
      if (response?.success) {
        loadContent();
      }
    });
  });

  // 打开 MultiPub 编辑器
  btnOpenEditor.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://multipub-five.vercel.app/' })
  });

  // 初始化
  loadContent();
});
