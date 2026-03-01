import type { ThemeStyles } from '../markdown/renderer'

// 默认主题 - 简洁大方
export const defaultTheme: ThemeStyles = {
  base: {
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.75',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '10px',
  },
  block: {
    h1: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#1a1a1a',
      margin: '30px 0 15px',
      textAlign: 'center',
      lineHeight: '1.4',
    },
    h2: {
      fontSize: '19px',
      fontWeight: 'bold',
      color: '#1a1a1a',
      margin: '25px 0 12px',
      borderBottom: '1px solid #eee',
      paddingBottom: '8px',
      lineHeight: '1.4',
    },
    h3: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: '#333',
      margin: '20px 0 10px',
      lineHeight: '1.4',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#444',
      margin: '15px 0 8px',
    },
    p: {
      fontSize: '15px',
      lineHeight: '1.75',
      margin: '10px 0',
      color: '#333',
    },
    blockquote: {
      borderLeft: '3px solid #2196F3',
      padding: '10px 15px',
      margin: '15px 0',
      background: '#f8f9fa',
      color: '#666',
      fontSize: '14px',
    },
    pre: {
      background: '#282c34',
      borderRadius: '5px',
      margin: '15px 0',
      overflow: 'auto',
    },
    code: {
      display: 'block',
      padding: '10px 14px',
      fontSize: '13px',
      lineHeight: '1.6',
      color: '#abb2bf',
      overflowX: 'auto',
    },
    ul: {
      paddingLeft: '0',
      margin: '10px 0',
      listStyleType: 'none',
    },
    ol: {
      paddingLeft: '0',
      margin: '10px 0',
      listStyleType: 'none',
    },
    listitem: {
      fontSize: '15px',
      lineHeight: '1.75',
      margin: '5px 0',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '15px 0',
      fontSize: '14px',
    },
    th: {
      background: '#f5f5f5',
      border: '1px solid #ddd',
      padding: '8px 12px',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px 12px',
    },
    hr: {
      border: 'none',
      borderTop: '1px solid #eee',
      margin: '20px 0',
    },
    figcaption: {
      fontSize: '13px',
      color: '#999',
      marginTop: '5px',
    },
  },
  inline: {
    codespan: {
      background: 'rgba(27, 31, 35, 0.05)',
      color: '#c7254e',
      padding: '2px 4px',
      borderRadius: '3px',
      fontSize: '90%',
    },
    strong: {
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: '#2196F3',
      textDecoration: 'none',
      borderBottom: '1px solid #2196F3',
    },
  },
}

// 科技风主题 - 深色配色
export const techTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#0070f3',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#0070f3',
      borderBottom: '2px solid #0070f3',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#0070f3',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #0070f3',
      background: '#f0f7ff',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#0070f3',
      background: 'rgba(0, 112, 243, 0.06)',
    },
    link: {
      color: '#0070f3',
      textDecoration: 'none',
      borderBottom: '1px solid #0070f3',
    },
  },
}

// 暖色主题 - 温暖柔和
export const warmTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#e65100',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#e65100',
      borderBottom: '2px solid #ff9800',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#f57c00',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #ff9800',
      background: '#fff8e1',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#e65100',
      background: 'rgba(255, 152, 0, 0.08)',
    },
    link: {
      color: '#e65100',
      textDecoration: 'none',
      borderBottom: '1px solid #ff9800',
    },
  },
}

// 绿色清新主题
export const greenTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#2e7d32',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#2e7d32',
      borderBottom: '2px solid #4caf50',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#388e3c',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #4caf50',
      background: '#e8f5e9',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#2e7d32',
      background: 'rgba(76, 175, 80, 0.08)',
    },
    link: {
      color: '#2e7d32',
      textDecoration: 'none',
      borderBottom: '1px solid #4caf50',
    },
  },
}

// 紫色优雅主题
export const purpleTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#6a1b9a',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#6a1b9a',
      borderBottom: '2px solid #9c27b0',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#7b1fa2',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #9c27b0',
      background: '#f3e5f5',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#6a1b9a',
      background: 'rgba(156, 39, 176, 0.08)',
    },
    link: {
      color: '#6a1b9a',
      textDecoration: 'none',
      borderBottom: '1px solid #9c27b0',
    },
  },
}

// 活力橙主题 - 橙色主色调
export const orangeTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#ea580c',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#ea580c',
      borderBottom: '2px solid #f97316',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#f97316',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #f97316',
      background: '#fff7ed',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#ea580c',
      background: 'rgba(249, 115, 22, 0.08)',
    },
    link: {
      color: '#ea580c',
      textDecoration: 'none',
      borderBottom: '1px solid #f97316',
    },
  },
}

// 商务灰主题 - 灰色专业风格
export const grayTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#18181b',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#27272a',
      borderBottom: '2px solid #71717a',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#3f3f46',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #71717a',
      background: '#f4f4f5',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#3f3f46',
      background: 'rgba(113, 113, 122, 0.1)',
    },
    link: {
      color: '#3f3f46',
      textDecoration: 'none',
      borderBottom: '1px solid #71717a',
    },
  },
}

// 粉色甜美主题 - 粉色女性向
export const pinkTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#db2777',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#db2777',
      borderBottom: '2px solid #ec4899',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#ec4899',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #ec4899',
      background: '#fdf2f8',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#db2777',
      background: 'rgba(236, 72, 153, 0.08)',
    },
    link: {
      color: '#db2777',
      textDecoration: 'none',
      borderBottom: '1px solid #ec4899',
    },
  },
}

// 深邃黑主题 - 深色主题
export const darkTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
    color: '#e5e5e5',
    background: '#1a1a1a',
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#fafafa',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#fafafa',
      borderBottom: '2px solid #525252',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#e5e5e5',
    },
    p: {
      ...defaultTheme.block.p,
      color: '#e5e5e5',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #525252',
      background: '#262626',
      color: '#a3a3a3',
    },
    pre: {
      ...defaultTheme.block.pre,
      background: '#0d0d0d',
    },
    listitem: {
      ...defaultTheme.block.listitem,
      color: '#e5e5e5',
    },
    table: {
      ...defaultTheme.block.table,
    },
    th: {
      ...defaultTheme.block.th,
      background: '#262626',
      border: '1px solid #404040',
    },
    td: {
      ...defaultTheme.block.td,
      border: '1px solid #404040',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#fbbf24',
      background: 'rgba(251, 191, 36, 0.1)',
    },
    strong: {
      ...defaultTheme.inline.strong,
      color: '#fafafa',
    },
    link: {
      color: '#60a5fa',
      textDecoration: 'none',
      borderBottom: '1px solid #60a5fa',
    },
  },
}

// 森林绿主题 - 深绿色
export const forestTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#14532d',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#14532d',
      borderBottom: '2px solid #15803d',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#15803d',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #15803d',
      background: '#f0fdf4',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#14532d',
      background: 'rgba(21, 128, 61, 0.08)',
    },
    link: {
      color: '#14532d',
      textDecoration: 'none',
      borderBottom: '1px solid #15803d',
    },
  },
}

// 海洋蓝主题 - 浅蓝色
export const oceanTheme: ThemeStyles = {
  base: {
    ...defaultTheme.base,
  },
  block: {
    ...defaultTheme.block,
    h1: {
      ...defaultTheme.block.h1,
      color: '#0369a1',
    },
    h2: {
      ...defaultTheme.block.h2,
      color: '#0369a1',
      borderBottom: '2px solid #0ea5e9',
    },
    h3: {
      ...defaultTheme.block.h3,
      color: '#0284c7',
    },
    blockquote: {
      ...defaultTheme.block.blockquote,
      borderLeft: '3px solid #0ea5e9',
      background: '#f0f9ff',
    },
  },
  inline: {
    ...defaultTheme.inline,
    codespan: {
      ...defaultTheme.inline.codespan,
      color: '#0369a1',
      background: 'rgba(14, 165, 233, 0.08)',
    },
    link: {
      color: '#0369a1',
      textDecoration: 'none',
      borderBottom: '1px solid #0ea5e9',
    },
  },
}

// 主题列表
export const themes: Record<string, { name: string; theme: ThemeStyles }> = {
  default: { name: '默认简洁', theme: defaultTheme },
  tech: { name: '科技蓝', theme: techTheme },
  warm: { name: '暖色柔和', theme: warmTheme },
  green: { name: '清新绿', theme: greenTheme },
  purple: { name: '优雅紫', theme: purpleTheme },
  orange: { name: '活力橙', theme: orangeTheme },
  gray: { name: '商务灰', theme: grayTheme },
  pink: { name: '粉色甜美', theme: pinkTheme },
  dark: { name: '深邃黑', theme: darkTheme },
  forest: { name: '森林绿', theme: forestTheme },
  ocean: { name: '海洋蓝', theme: oceanTheme },
}
