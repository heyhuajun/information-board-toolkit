import type { Component } from '@/types'
import Section from './Section'
import Card from './Card'
import CardGrid from './CardGrid'
import Table from './Table'
import List from './List'
import Metric from './Metric'
import Chart from './Chart'
import Markdown from './Markdown'
import Image from './Image'
import Alert from './Alert'
import Divider from './Divider'
import DataSource from './DataSource'
import CompareTable from './CompareTable'
import DataBadge from './DataBadge'
import Tag from './Tag'
import Badge from './Badge'

interface ComponentRendererProps {
  component: Component
}

export default function ComponentRenderer({ component }: ComponentRendererProps) {
  switch (component.type) {
    case 'section':
      return <Section {...component} />
    case 'card':
      return <Card {...component} />
    case 'card-grid':
      return <CardGrid {...component} />
    case 'table':
      return <Table {...component} />
    case 'list':
      return <List {...component} />
    case 'metric':
      return <Metric {...component} />
    case 'chart':
      return <Chart {...component} />
    case 'markdown':
      return <Markdown {...component} />
    case 'image':
      return <Image {...component} />
    case 'alert':
      return <Alert {...component} />
    case 'divider':
      return <Divider />
    // Phase 1 新组件
    case 'dataSource':
      return <DataSource {...component} />
    case 'compareTable':
      return <CompareTable {...component} />
    case 'dataBadge':
      return <DataBadge {...component} />
    case 'tag':
      return <Tag {...component} />
    case 'badge':
      return <Badge {...component} />
    default:
      return null
  }
}
