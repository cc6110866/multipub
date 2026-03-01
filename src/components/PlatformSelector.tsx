'use client'

import { platforms } from '@/lib/platforms'

interface PlatformSelectorProps {
  currentPlatform: string
  onPlatformChange: (platformId: string) => void
}

export default function PlatformSelector({ currentPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">平台：</span>
      <div className="flex gap-1.5">
        {Object.values(platforms).map((platform) => (
          <button
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={`px-3 py-1.5 text-xs rounded transition-all cursor-pointer flex items-center gap-1 ${
              currentPlatform === platform.id
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={platform.description}
          >
            <span>{platform.icon}</span>
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
