// MultiPub Background Service Worker
// 处理来自 Web 端的消息和存储管理

// 监听来自外部（MultiPub Web）的消息
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log('[MultiPub] Received external message:', request);

    if (request.type === 'MULTIPUB_CONTENT') {
      // 存储内容到 chrome.storage
      chrome.storage.local.set({
        multipubContent: {
          html: request.html,
          theme: request.theme,
          timestamp: Date.now()
        }
      }).then(() => {
        console.log('[MultiPub] Content saved to storage');
        sendResponse({ success: true, message: '内容已保存，请打开公众号编辑器' });
      }).catch((error) => {
        console.error('[MultiPub] Storage error:', error);
        sendResponse({ success: false, message: '存储失败: ' + error.message });
      });

      return true; // 保持消息通道开启，等待异步响应
    }

    if (request.type === 'MULTIPUB_PING') {
      sendResponse({ success: true, version: '1.0.0' });
      return true;
    }
  }
);

// 监听扩展内部消息（来自 content script 或 popup）
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log('[MultiPub] Received internal message:', request);

    if (request.type === 'GET_CONTENT') {
      chrome.storage.local.get(['multipubContent']).then((result) => {
        sendResponse({ success: true, content: result.multipubContent || null });
      }).catch((error) => {
        sendResponse({ success: false, message: error.message });
      });
      return true;
    }

    if (request.type === 'CLEAR_CONTENT') {
      chrome.storage.local.remove(['multipubContent']).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        sendResponse({ success: false, message: error.message });
      });
      return true;
    }
  }
);

// 监听标签页更新，检测公众号页面
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('mp.weixin.qq.com')) {
    console.log('[MultiPub] Detected WeChat MP page, tabId:', tabId);
    // 可以在这里发送通知给 content script
  }
});

console.log('[MultiPub] Background service worker started');
