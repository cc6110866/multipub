'use client'

import { themes } from '@/lib/themes'

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themeColors: Record<string, string> = {
    default: '#2196F3',
    tech: '#0070f3',
    warm: '#ff9800',
    green: '#4caf50',
    purple: '#9c27b0',
    orange: '#f97316',
    gray: '#71717a',
    pink: '#ec4899',
    dark: '#262626',
    forest: '#15803d',
    ocean: '#0ea5e9',
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500">主题：</span>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(themes).map(([id, { name }]) => (
          <button
            key={id}
            onClick={() => onThemeChange(id)}
            className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
              currentTheme === id
                ? 'text-white shadow-sm'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
            style={
              currentTheme === id
                ? { backgroundColor: themeColors[id] || '#2196F3' }
                : undefined
            }
            title={name}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
