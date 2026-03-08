import type { CardGridComponent } from '@/types'
import Card from './Card'

export default function CardGrid({ columns = 3, cards }: CardGridComponent) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  )
}
