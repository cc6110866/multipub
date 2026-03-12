// MultiPub Content Script for WeChat MP Editor
// 注入到公众号编辑器页面，负责将内容插入到编辑器

(function() {
  'use strict';

  console.log('[MultiPub] Content script loaded on WeChat MP');

  // 注入状态
  let injectButton = null;
  let lastContent = null;

  // 创建浮动注入按钮
  function createInjectButton() {
    if (injectButton) return;

    const button = document.createElement('div');
    button.id = 'multipub-inject-btn';
    button.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 99999;
        transition: transform 0.2s, box-shadow 0.2s;
        font-size: 24px;
      " title="MultiPub 注入内容">
        📝
      </div>
      <div id="multipub-tooltip" style="
        position: fixed;
        bottom: 140px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        display: none;
        z-index: 99999;
        white-space: nowrap;
      "></div>
    `;

    button.addEventListener('click', handleInject);
    button.addEventListener('mouseenter', () => {
      button.querySelector('div').style.transform = 'scale(1.1)';
      button.querySelector('div').style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    });
    button.addEventListener('mouseleave', () => {
      button.querySelector('div').style.transform = 'scale(1)';
      button.querySelector('div').style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });

    document.body.appendChild(button);
    injectButton = button;
    console.log('[MultiPub] Inject button created');
  }

  // 显示提示信息
  function showTooltip(message, duration = 2000) {
    const tooltip = document.getElementById('multipub-tooltip');
    if (tooltip) {
      tooltip.textContent = message;
      tooltip.style.display = 'block';
      setTimeout(() => {
        tooltip.style.display = 'none';
      }, duration);
    }
  }

  // 在页面上下文中执行脚本（突破 content script 隔离）
  function executeInPage(fn) {
    const script = document.createElement('script');
    script.textContent = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
    script.remove();
  }

  // 在页面上下文中注入内容
  function injectInPageContext(html) {
    const script = document.createElement('script');
    script.textContent = `
(function() {
  try {
    console.log('[MultiPub-Page] Starting injection...');

    // 方案 1：查找 UEditor 实例
    function findUEditor() {
      // 检查 window.UE
      if (window.UE && window.UE.getEditor) {
        // 尝试获取默认编辑器
        const editorIds = ['editor', 'ueditor', 'myEditor', 'content_editor'];
        for (const id of editorIds) {
          try {
            const editor = window.UE.getEditor(id);
            if (editor) {
              console.log('[MultiPub-Page] Found UEditor:', id);
              return editor;
            }
          } catch(e) {}
        }

        // 遍历所有编辑器实例
        if (window.UE.instants) {
          for (const key in window.UE.instants) {
            const editor = window.UE.instants[key];
            if (editor && editor.setContent) {
              console.log('[MultiPub-Page] Found UEditor instance:', key);
              return editor;
            }
          }
        }
      }
      return null;
    }

    // 方案 2：查找 contenteditable 元素
    function findContentEditable() {
      const selectors = [
        '#js_content',
        '.rich_media_content',
        '#edui1_iframeholder iframe',
        '[contenteditable="true"]'
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          console.log('[MultiPub-Page] Found editable element:', sel);
          return el;
        }
      }
      return null;
    }

    // 方案 3：操作 iframe
    function injectToIframe(iframe, html) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const body = doc.body;

        // 先聚焦
        body.focus();

        // 选中全部内容
        const sel = doc.getSelection();
        const range = doc.createRange();
        range.selectNodeContents(body);
        sel.removeAllRanges();
        sel.addRange(range);

        // 使用 execCommand 插入
        const success = doc.execCommand('insertHTML', false, html);
        if (success) {
          console.log('[MultiPub-Page] Injected via execCommand in iframe');
          return true;
        }

        // 降级到 innerHTML
        body.innerHTML = html;

        // 触发事件
        body.dispatchEvent(new Event('input', { bubbles: true }));
        body.dispatchEvent(new Event('change', { bubbles: true }));

        console.log('[MultiPub-Page] Injected via innerHTML in iframe');
        return true;
      } catch(e) {
        console.error('[MultiPub-Page] Iframe injection failed:', e);
        return false;
      }
    }

    // 主注入逻辑
    const html = ${JSON.stringify(html)};

    // 尝试 UEditor
    const ue = findUEditor();
    if (ue) {
      ue.ready(function() {
        ue.setContent(html, false);
        ue.fireEvent('contentChange');
        console.log('[MultiPub-Page] Content set via UEditor API');
        window.postMessage({ type: 'MULTIPUB_RESULT', success: true, method: 'UEditor' }, '*');
      });
      return;
    }

    // 尝试 iframe
    const iframe = document.querySelector('#edui1_iframeholder iframe, .edui-editor-iframeholder iframe, iframe[name^="ueditor"]');
    if (iframe) {
      const success = injectToIframe(iframe, html);
      if (success) {
        window.postMessage({ type: 'MULTIPUB_RESULT', success: true, method: 'iframe' }, '*');
        return;
      }
    }

    // 尝试 contenteditable
    const editable = findContentEditable();
    if (editable && editable.tagName !== 'IFRAME') {
      editable.focus();

      // 选中全部
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editable);
      sel.removeAllRanges();
      sel.addRange(range);

      // 插入
      const success = document.execCommand('insertHTML', false, html);
      if (success) {
        console.log('[MultiPub-Page] Injected via execCommand');
        window.postMessage({ type: 'MULTIPUB_RESULT', success: true, method: 'execCommand' }, '*');
        return;
      }

      // 降级
      editable.innerHTML = html;
      editable.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('[MultiPub-Page] Injected via innerHTML');
      window.postMessage({ type: 'MULTIPUB_RESULT', success: true, method: 'innerHTML' }, '*');
      return;
    }

    // 全部失败
    window.postMessage({ type: 'MULTIPUB_RESULT', success: false, message: 'No editable element found' }, '*');

  } catch(e) {
    console.error('[MultiPub-Page] Injection error:', e);
    window.postMessage({ type: 'MULTIPUB_RESULT', success: false, message: e.message }, '*');
  }
})();
    `;

    document.documentElement.appendChild(script);
    script.remove();
  }

  // 监听页面返回的结果
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'MULTIPUB_RESULT') {
      console.log('[MultiPub] Received result:', event.data);
      if (event.data.success) {
        showTooltip('✅ 内容注入成功！方法: ' + event.data.method);
      } else {
        showTooltip('❌ 注入失败: ' + (event.data.message || '未知错误'));
      }
    }
  });

  // 处理注入点击
  function handleInject() {
    // 从 background 获取存储的内容
    chrome.runtime.sendMessage({ type: 'GET_CONTENT' }, (response) => {
      if (!response?.success) {
        showTooltip('❌ 获取内容失败');
        return;
      }

      const content = response.content;
      if (!content) {
        showTooltip('⚠️ 没有待注入的内容，请先在 MultiPub 编辑');
        return;
      }

      // 检查内容是否过期（24小时）
      const isExpired = Date.now() - content.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        showTooltip('⚠️ 内容已过期，请重新发送');
        return;
      }

      showTooltip('⏳ 正在注入...', 5000);

      // 在页面上下文中执行注入
      injectInPageContext(content.html);
      lastContent = content;
    });
  }

  // 检查是否有待注入内容
  function checkPendingContent() {
    chrome.runtime.sendMessage({ type: 'GET_CONTENT' }, (response) => {
      if (response?.success && response.content) {
        showTooltip('📝 有待注入内容，点击按钮注入', 3000);
      }
    });
  }

  // 监听来自 background 的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'CONTENT_READY') {
      showTooltip('📝 内容已准备就绪，点击按钮注入', 3000);
      sendResponse({ success: true });
    }
  });

  // 初始化
  function init() {
    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          createInjectButton();
          checkPendingContent();
        }, 1000);
      });
    } else {
      setTimeout(() => {
        createInjectButton();
        checkPendingContent();
      }, 1000);
    }
  }

  init();
})();
