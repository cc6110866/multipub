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

  // 获取编辑器 iframe
  function getEditorIframe() {
    // 尝试多种方式获取编辑器
    const selectors = [
      '#edui1_iframeholder iframe',
      '#edui1_iframe',
      '.edui-editor-iframeholder iframe',
      'iframe[name^="ueditor"]'
    ];

    for (const selector of selectors) {
      const iframe = document.querySelector(selector);
      if (iframe) {
        console.log('[MultiPub] Found editor iframe:', selector);
        return iframe;
      }
    }

    console.warn('[MultiPub] Editor iframe not found');
    return null;
  }

  // 注入内容到编辑器
  function injectContentToEditor(html) {
    const iframe = getEditorIframe();

    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const body = iframeDoc.body;

        if (body) {
          // 清空现有内容或追加
          body.innerHTML = html;
          console.log('[MultiPub] Content injected to iframe');
          return true;
        }
      } catch (error) {
        console.error('[MultiPub] Iframe injection failed:', error);
      }
    }

    // 备用方案：尝试直接操作页面元素
    const editorArea = document.querySelector('.rich_media_content') ||
                       document.querySelector('[contenteditable="true"]');

    if (editorArea) {
      editorArea.innerHTML = html;
      console.log('[MultiPub] Content injected to editor area');
      return true;
    }

    return false;
  }

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

      // 注入内容
      const success = injectContentToEditor(content.html);

      if (success) {
        showTooltip('✅ 内容注入成功！');
        lastContent = content;

        // 可选：注入后清除存储
        // chrome.runtime.sendMessage({ type: 'CLEAR_CONTENT' });
      } else {
        showTooltip('❌ 注入失败，请确保已打开编辑器');
      }
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
