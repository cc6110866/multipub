export interface PlatformConfig {
  id: string
  name: string
  icon: string
  description: string
  features: {
    supportsStyleTag: boolean
    supportsExternalLinks: boolean
    supportsLatex: boolean
    requiresInlineStyle: boolean
    codeBlockStyle: 'wechat' | 'github'
  }
  // 特殊处理规则
  preprocess?: (html: string) => string
  postprocess?: (html: string) => string
  // 复制成功提示
  copySuccessMessage: string
}

export const platforms: Record<string, PlatformConfig> = {
  wechat: {
    id: 'wechat',
    name: '微信公众号',
    icon: '💬',
    description: '微信生态，需要 inline style',
    features: {
      supportsStyleTag: false,
      supportsExternalLinks: false,
      supportsLatex: false,
      requiresInlineStyle: true,
      codeBlockStyle: 'wechat'
    },
    // 微信公众号特殊处理：代码块换行使用 <br>
    postprocess: (html: string) => {
      // 将代码块中的 \n 替换为 <br>（保留代码高亮）
      return html.replace(/<code([^>]*)>([\s\S]*?)<\/code>/g, (match, attrs, content) => {
        // 只处理代码块内的换行，不处理行内代码
        if (attrs.includes('class="language-')) {
          return `<code${attrs}>${content}</code>`
        }
        return match
      })
    },
    copySuccessMessage: '已复制！可直接粘贴到公众号。注意：图片需手动上传'
  },
  zhihu: {
    id: 'zhihu',
    name: '知乎专栏',
    icon: '📝',
    description: '知识分享平台',
    features: {
      supportsStyleTag: true,
      supportsExternalLinks: true,
      supportsLatex: false,
      requiresInlineStyle: false,
      codeBlockStyle: 'github'
    },
    copySuccessMessage: '已复制！可在知乎专栏直接粘贴'
  },
  juejin: {
    id: 'juejin',
    name: '掘金',
    icon: '💎',
    description: '开发者社区',
    features: {
      supportsStyleTag: true,
      supportsExternalLinks: true,
      supportsLatex: true,
      requiresInlineStyle: false,
      codeBlockStyle: 'github'
    },
    copySuccessMessage: '已复制！可在掘金直接粘贴'
  }
}

// 获取默认平台（微信公众号）
export function getDefaultPlatform(): string {
  return 'wechat'
}

// 获取平台配置
export function getPlatformConfig(platformId: string): PlatformConfig {
  return platforms[platformId] || platforms.wechat
}
