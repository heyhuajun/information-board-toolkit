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
  DoughnutChart,
  Doughnut,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function Chart({ chartType, title, data }: ChartComponent) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data.labels.map((label, i) => ({
            name: label,
            ...data.datasets.reduce((acc, dataset) => ({
              ...acc,
              [dataset.label]: dataset.data[i]
            }), {})
          }))}>
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
          <BarChart data={data.labels.map((label, i) => ({
            name: label,
            ...data.datasets.reduce((acc, dataset) => ({
              ...acc,
              [dataset.label]: dataset.data[i]
            }), {})
          }))}>
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
        ) : chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={data.labels.map((label, i) => ({
                name: label,
                value: data.datasets[0].data[i]
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
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
        ) : chartType === 'doughnut' ? (
          <DoughnutChart>
            <Doughnut
              data={data.labels.map((label, i) => ({
                name: label,
                value: data.datasets[0].data[i]
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {data.labels.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Doughnut>
            <Tooltip />
            <Legend />
          </DoughnutChart>
        ) : null}
      </ResponsiveContainer>
    </div>
  )
}
