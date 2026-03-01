import { marked, type RendererObject, type Tokens } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import sql from 'highlight.js/lib/languages/sql'
import java from 'highlight.js/lib/languages/java'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import yaml from 'highlight.js/lib/languages/yaml'

// 注册常用语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('java', java)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)

export { hljs }

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const macCodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="13" viewBox="0 0 450 130"><ellipse cx="50" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)"/><ellipse cx="225" cy="65" rx="50" ry="52" stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)"/><ellipse cx="400" cy="65" rx="50" ry="52" stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)"/></svg>`

export interface ThemeStyles {
  base: Record<string, string>
  block: Record<string, Record<string, string>>
  inline: Record<string, Record<string, string>>
}

export interface RendererOptions {
  theme: ThemeStyles
  citeStatus?: boolean
  showLineNumber?: boolean
  platform?: string // 平台 ID
}

function styleToString(style: Record<string, string>): string {
  return Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}

export function renderMarkdown(md: string, options: RendererOptions): string {
  const { theme, citeStatus = true, platform = 'wechat' } = options
  const footnotes: [number, string, string][] = []
  let footnoteIndex = 0
  
  // 微信公众号不支持外部链接，不生成脚注
  const shouldGenerateFootnotes = platform !== 'wechat' && citeStatus

  function getStyle(type: string, isBlock = true): string {
    const styles = isBlock ? theme.block : theme.inline
    const style = styles[type]
    if (!style) return ''
    return ` style="${styleToString(style)}"`
  }

  function addFootnote(title: string, link: string): number {
    const existing = footnotes.find(([, , l]) => l === link)
    if (existing) return existing[0]
    footnotes.push([++footnoteIndex, title, link])
    return footnoteIndex
  }

  const renderer: RendererObject = {
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens)
      const tag = `h${depth}`
      const style = theme.block[tag] ? ` style="${styleToString(theme.block[tag])}"` : ''
      return `<${tag}${style}>${text}</${tag}>`
    },

    paragraph({ tokens }: Tokens.Paragraph): string {
      const text = this.parser.parseInline(tokens)
      if (text.includes('<figure') && text.includes('<img')) return text
      if (text.trim() === '') return ''
      return `<p${getStyle('p')}>${text}</p>`
    },

    blockquote({ tokens }: Tokens.Blockquote): string {
      const text = this.parser.parse(tokens)
      return `<blockquote${getStyle('blockquote')}>${text}</blockquote>`
    },

    code({ text, lang = '' }: Tokens.Code): string {
      const langText = lang.split(' ')[0]
      const isRegistered = hljs.getLanguage(langText)
      const language = isRegistered ? langText : 'plaintext'

      let highlighted: string
      try {
        highlighted = language === 'plaintext'
          ? escapeHtml(text)
          : hljs.highlight(text, { language }).value
      } catch {
        highlighted = escapeHtml(text)
      }

      const codeStyle = theme.block.code ? ` style="${styleToString(theme.block.code)}"` : ''
      const preStyle = theme.block.pre ? ` style="${styleToString(theme.block.pre)}"` : ''
      const macSign = `<span style="padding: 10px 14px 0; display: block;">${macCodeSvg}</span>`

      return `<pre${preStyle}>${macSign}<code class="language-${langText}"${codeStyle}>${highlighted}</code></pre>`
    },

    codespan({ text }: Tokens.Codespan): string {
      const escapedText = escapeHtml(text)
      return `<code${getStyle('codespan', false)}>${escapedText}</code>`
    },

    list({ ordered, items, start = 1 }: Tokens.List) {
      const tag = ordered ? 'ol' : 'ul'
      const html = items.map((item, i) => {
        const prefix = ordered ? `${Number(start) + i}. ` : '• '
        let content: string
        try {
          content = this.parser.parseInline(item.tokens)
        } catch {
          content = this.parser.parse(item.tokens).replace(/^<p[^>]*>([\s\S]*?)<\/p>/, '$1')
        }
        return `<li${getStyle('listitem')}>${prefix}${content}</li>`
      }).join('')
      return `<${tag}${getStyle(tag)}>${html}</${tag}>`
    },

    listitem(token: Tokens.ListItem) {
      let content: string
      try {
        content = this.parser.parseInline(token.tokens)
      } catch {
        content = this.parser.parse(token.tokens).replace(/^<p[^>]*>([\s\S]*?)<\/p>/, '$1')
      }
      return `<li${getStyle('listitem')}>${content}</li>`
    },

    image({ href, title, text }: Tokens.Image): string {
      const titleAttr = title ? ` title="${title}"` : ''
      const figcaptionStyle = theme.block.figcaption ? ` style="${styleToString(theme.block.figcaption)}"` : ''
      const subText = text ? `<figcaption${figcaptionStyle}>${text}</figcaption>` : ''
      return `<figure style="text-align: center; margin: 20px 0;"><img src="${href}"${titleAttr} alt="${text}" style="max-width: 100%; border-radius: 4px;"/>${subText}</figure>`
    },

    link({ href, title, text, tokens }: Tokens.Link): string {
      const parsedText = this.parser.parseInline(tokens)
      if (shouldGenerateFootnotes) {
        const ref = addFootnote(title || text, href)
        return `<a href="${href}" title="${title || text}"${getStyle('link', false)}>${parsedText}<sup>[${ref}]</sup></a>`
      }
      return `<a href="${href}" title="${title || text}"${getStyle('link', false)}>${parsedText}</a>`
    },

    strong({ tokens }: Tokens.Strong): string {
      return `<strong${getStyle('strong', false)}>${this.parser.parseInline(tokens)}</strong>`
    },

    em({ tokens }: Tokens.Em): string {
      return `<em${getStyle('em', false)}>${this.parser.parseInline(tokens)}</em>`
    },

    table({ header, rows }: Tokens.Table): string {
      const thStyle = theme.block.th ? ` style="${styleToString(theme.block.th)}"` : ''
      const tdStyle = theme.block.td ? ` style="${styleToString(theme.block.td)}"` : ''
      const tableStyle = theme.block.table ? ` style="${styleToString(theme.block.table)}"` : ''

      const headerRow = header
        .map(cell => `<th${thStyle}>${this.parser.parseInline(cell.tokens)}</th>`)
        .join('')
      const body = rows
        .map(row => {
          const rowContent = row.map(cell => `<td${tdStyle}>${this.parser.parseInline(cell.tokens)}</td>`).join('')
          return `<tr>${rowContent}</tr>`
        })
        .join('')

      return `<section style="max-width: 100%; overflow: auto;"><table${tableStyle}><thead><tr>${headerRow}</tr></thead><tbody>${body}</tbody></table></section>`
    },

    tablecell(token: Tokens.TableCell): string {
      const text = this.parser.parseInline(token.tokens)
      const tdStyle = theme.block.td ? ` style="${styleToString(theme.block.td)}"` : ''
      return `<td${tdStyle}>${text}</td>`
    },

    hr(): string {
      const hrStyle = theme.block.hr ? ` style="${styleToString(theme.block.hr)}"` : ''
      return `<hr${hrStyle}/>`
    },
  }

  marked.setOptions({ breaks: true })
  marked.use({ renderer })

  const html = marked.parse(md) as string

  // 构建脚注（仅当 shouldGenerateFootnotes 为 true 时）
  let footnotesHtml = ''
  if (shouldGenerateFootnotes && footnotes.length > 0) {
    const h4Style = theme.block.h4 ? ` style="${styleToString(theme.block.h4)}"` : ''
    const items = footnotes
      .map(([index, title, link]) =>
        link === title
          ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${title}</i><br/>`
          : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`
      )
      .join('\n')
    footnotesHtml = `<h4${h4Style}>引用链接</h4><p style="font-size: 14px; color: #888;">${items}</p>`
  }

  const containerStyle = theme.base ? ` style="${styleToString(theme.base)}"` : ''
  return `<section${containerStyle}>${html}${footnotesHtml}</section>`
}
