import type { VersionHistoryComponent } from '@/types'
import { useState } from 'react'

export default function VersionHistory({
  currentVersion,
  versions,
  onRestore,
  onCompare
}: Omit<VersionHistoryComponent, 'type'>) {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([])

  const formatDate = (date?: Date | string) => {
    if (!date) return '未知时间'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleVersion = (version: number) => {
    setSelectedVersions(prev => {
      if (prev.includes(version)) {
        return prev.filter(v => v !== version)
      }
      if (prev.length >= 2) {
        return [prev[1], version]
      }
      return [...prev, version]
    })
  }

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompare) {
      const v1 = versions.find(v => v.version === selectedVersions[0])
      const v2 = versions.find(v => v.version === selectedVersions[1])
      if (v1 && v2) {
        onCompare(v1, v2)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">版本历史</h3>
          <span className="text-sm text-gray-500">当前: v{currentVersion}</span>
        </div>
        {selectedVersions.length === 2 && onCompare && (
          <button
            onClick={handleCompare}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            对比选中版本
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {versions.map((version) => {
          const isCurrent = version.version === currentVersion
          const isSelected = selectedVersions.includes(version.version)

          return (
            <div
              key={version.version}
              className={`px-4 py-3 flex items-start gap-3 ${
                isCurrent ? 'bg-blue-50' : isSelected ? 'bg-gray-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleVersion(version.version)}
                className="mt-1 rounded border-gray-300"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    v{version.version}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      当前版本
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDate(version.createdAt)}
                  </span>
                </div>
                
                {version.author && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    作者: {version.author}
                  </p>
                )}
                
                {version.changes && version.changes.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-gray-400">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {onRestore && !isCurrent && (
                <button
                  onClick={() => onRestore(version)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  恢复
                </button>
              )}
            </div>
          )
        })}
      </div>

      {versions.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          暂无历史版本
        </div>
      )}
    </div>
  )
}
