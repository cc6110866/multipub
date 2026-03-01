'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorView, lineNumbers, drawSelection, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { keymap } from '@codemirror/view'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  onCopy?: () => void
  onOpen?: () => void
}

export default function Editor({ value, onChange, onSave, onCopy, onOpen }: EditorProps) {
  const editorRef = useRef<EditorView | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState(500)

  // 计算容器高度
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setEditorHeight(rect.height)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const handleChange = useCallback((val: string) => {
    onChange(val)
  }, [onChange])

  // 创建快捷键映射
  const createKeyBindings = useCallback(() => {
    const keyBindings: { key: string; run: () => boolean }[] = []
    
    if (onSave) {
      keyBindings.push({
        key: 'Mod-s',
        run: () => {
          onSave()
          return true
        }
      })
    }
    
    if (onCopy) {
      keyBindings.push({
        key: 'Mod-Shift-c',
        run: () => {
          onCopy()
          return true
        }
      })
    }
    
    if (onOpen) {
      keyBindings.push({
        key: 'Mod-o',
        run: () => {
          onOpen()
          return true
        }
      })
    }
    
    return keyBindings
  }, [onSave, onCopy, onOpen])

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
        <span className="text-sm font-medium text-gray-600">📝 Markdown 编辑</span>
        <div className="text-xs text-gray-400">
          <span className="mr-3">Ctrl+S 保存</span>
          <span className="mr-3">Ctrl+Shift+C 复制</span>
          <span>Ctrl+O 打开</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0">
        <CodeMirror
          value={value}
          height={`${editorHeight}px`}
          extensions={[
            lineNumbers(),
            history(),
            drawSelection(),
            bracketMatching(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            markdown({ base: markdownLanguage }),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            keymap.of([
              ...defaultKeymap,
              ...historyKeymap,
              indentWithTab,
              ...createKeyBindings()
            ]),
            EditorView.lineWrapping,
            EditorView.theme({
              '&': { height: '100%' },
              '.cm-scroller': { overflow: 'auto' },
              '.cm-content': { 
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                fontSize: '14px',
                padding: '16px'
              },
              '.cm-gutters': {
                backgroundColor: '#f9fafb',
                border: 'none'
              },
              '.cm-lineNumbers .cm-gutterElement': {
                color: '#9ca3af',
                padding: '0 8px 0 16px'
              }
            })
          ]}
          onChange={handleChange}
          onCreateEditor={(view) => {
            editorRef.current = view
          }}
          placeholder="在这里输入 Markdown 内容..."
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: false,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: false,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: false,
            completionKeymap: false,
            lintKeymap: false
          }}
        />
      </div>
    </div>
  )
}
