// Chrome Extension API 类型声明
// 用于 TypeScript 类型检查

interface ChromeRuntimeMessageOptions {
  type: string
  [key: string]: unknown
}

interface ChromeRuntimeMessageResponse {
  success: boolean
  message?: string
  [key: string]: unknown
}

declare global {
  interface Window {
    chrome?: typeof chrome
  }

  namespace chrome {
    namespace runtime {
      // 发送消息到扩展（带扩展 ID）
      function sendMessage(
        extensionId: string,
        message: ChromeRuntimeMessageOptions,
        callback?: (response: ChromeRuntimeMessageResponse) => void
      ): void

      // 发送消息（无扩展 ID）
      function sendMessage(
        message: ChromeRuntimeMessageOptions,
        callback?: (response: ChromeRuntimeMessageResponse) => void
      ): void

      const lastError: {
        message: string
      } | undefined
    }
  }
}

export {}
