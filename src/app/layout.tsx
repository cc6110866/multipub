import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MultiPub - 多平台内容发布',
  description: '将 Markdown 文章一键转换为公众号格式，告别繁琐排版。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
