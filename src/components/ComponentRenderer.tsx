import type { Component } from '@/types'
import Section from './Section'
import Card from './Card'
import CardGrid from './CardGrid'
import Table from './Table'
import List from './List'
import Metric from './Metric'
import Markdown from './Markdown'
import Image from './Image'
import Alert from './Alert'
import Divider from './Divider'

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
    case 'markdown':
      return <Markdown {...component} />
    case 'image':
      return <Image {...component} />
    case 'alert':
      return <Alert {...component} />
    case 'divider':
      return <Divider />
    default:
      return null
  }
}
