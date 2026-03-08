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
// Phase 1 组件
import DataSource from './DataSource'
import CompareTable from './CompareTable'
import DataBadge from './DataBadge'
import Tag from './Tag'
import Badge from './Badge'
// Phase 2 组件
import Quote from './Quote'
import Timeline from './Timeline'
import Progress from './Progress'
import Collapse from './Collapse'
import Comments from './Comments'
import VersionHistory from './VersionHistory'
import Template from './Template'

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
    // Phase 1 组件
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
    // Phase 2 组件
    case 'quote':
      return <Quote {...component} />
    case 'timeline':
      return <Timeline {...component} />
    case 'progress':
      return <Progress {...component} />
    case 'collapse':
      return <Collapse {...component} />
    case 'comments':
      return <Comments {...component} />
    case 'versionHistory':
      return <VersionHistory {...component} />
    case 'template':
      return <Template {...component} />
    default:
      return null
  }
}
