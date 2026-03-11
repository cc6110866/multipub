// MultiPub Website Content Script
// 注入到 MultiPub 网站，提供扩展检测

(function() {
  'use strict';

  console.log('[MultiPub] Extension detected on website');

  // 注入扩展 ID 标记，让网页可以检测扩展是否安装
  const marker = document.createElement('meta');
  marker.name = 'multipub-extension-id';
  marker.content = chrome.runtime.id;
  
  // 等待 head 可用
  if (document.head) {
    document.head.appendChild(marker);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head?.appendChild(marker);
    });
  }
  
  console.log('[MultiPub] Extension marker injected, ID:', chrome.runtime.id);

})();
