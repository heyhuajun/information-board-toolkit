'use client'

import type { ChartComponent } from '@/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

// 空数据提示组件
function EmptyChart({ message = '暂无数据' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-[300px] text-gray-400">
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default function Chart({ chartType, title, data }: ChartComponent) {
  // 边界检查：空数据处理
  if (!data?.labels?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <EmptyChart message="缺少标签数据" />
      </div>
    )
  }

  if (!data?.datasets?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <EmptyChart message="缺少数据集" />
      </div>
    )
  }

  // 检查数据集是否为空
  const hasData = data.datasets.some(dataset => dataset.data?.length > 0)
  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <EmptyChart />
      </div>
    )
  }

  // 构建图表数据
  const chartData = data.labels.map((label, i) => ({
    name: label,
    ...data.datasets.reduce((acc, dataset) => ({
      ...acc,
      [dataset.label]: dataset.data[i] ?? 0
    }), {})
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.label}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        ) : chartType === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Bar
                key={index}
                dataKey={dataset.label}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        ) : (chartType === 'pie' || chartType === 'doughnut') ? (
          <PieChart>
            <Pie
              data={data.labels.map((label, i) => ({
                name: label,
                value: data.datasets[0]?.data[i] ?? 0
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={chartType === 'doughnut' ? 40 : 0}
              fill="#8884d8"
              dataKey="value"
            >
              {data.labels.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : chartType === 'radar' ? (
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Radar
                key={index}
                name={dataset.label}
                dataKey={dataset.label}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        ) : (
          <EmptyChart message={`不支持的图表类型: ${chartType}`} />
        )}
      </ResponsiveContainer>
    </div>
  )
}
