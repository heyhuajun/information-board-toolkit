import type { TemplateComponent, Component } from '@/types'
import ComponentRenderer from './ComponentRenderer'

// 预设模板
const PRESET_TEMPLATES: Record<string, TemplateComponent> = {
  'competitive-analysis': {
    type: 'template',
    templateId: 'competitive-analysis',
    name: '竞品分析模板',
    category: '市场研究',
    variables: {}
  },
  'market-research': {
    type: 'template',
    templateId: 'market-research',
    name: '市场研究报告模板',
    category: '市场研究',
    variables: {}
  },
  'user-research': {
    type: 'template',
    templateId: 'user-research',
    name: '用户调研报告模板',
    category: '用户研究',
    variables: {}
  },
  'hardware-planning': {
    type: 'template',
    templateId: 'hardware-planning',
    name: '硬件规划模板',
    category: '硬件规划',
    variables: {}
  },
  'compliance-bp': {
    type: 'template',
    templateId: 'compliance-bp',
    name: '合规BP模板',
    category: '合规',
    variables: {}
  }
}

interface TemplateProps {
  templateId: string
  name?: string
  category?: string
  variables?: Record<string, string | number>
  children?: Component[]
}

export default function Template({
  templateId,
  name,
  category,
  variables = {},
  children
}: TemplateProps) {
  const template = PRESET_TEMPLATES[templateId]

  const displayName = name || template?.name || templateId
  const displayCategory = category || template?.category

  if (!template && !name) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        模板 "{templateId}" 不存在
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <div>
              <h3 className="font-medium text-gray-900">{displayName}</h3>
              {displayCategory && (
                <p className="text-xs text-gray-500">{displayCategory}</p>
              )}
            </div>
          </div>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
            模板
          </span>
        </div>
      </div>

      <div className="p-4">
        {children && children.length > 0 && (
          <div className="space-y-4">
            {children.map((child, index) => (
              <ComponentRenderer key={index} component={child} />
            ))}
          </div>
        )}
        
        {Object.keys(variables).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">填充变量</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 导出预设模板列表
export function getTemplateList() {
  return Object.values(PRESET_TEMPLATES).map(t => ({
    id: t.templateId,
    name: t.name,
    category: t.category
  }))
}

// 应用模板变量
export function applyTemplate(
  templateId: string,
  variables: Record<string, string | number>
): TemplateComponent | null {
  const template = PRESET_TEMPLATES[templateId]
  if (!template) return null
  return { ...template, variables }
}
