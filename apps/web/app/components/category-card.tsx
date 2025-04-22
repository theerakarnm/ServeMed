import { Link } from "@remix-run/react"

interface CategoryCardProps {
  category: {
    categoryId: number
    name: string
    imageUrl?: string
    productCount?: number
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.imageUrl || "/placeholder.svg?height=96&width=96"

  return (
    <Link to={`/categories/${category.categoryId}`} className="flex flex-col items-center text-center group">
      <div className="h-24 w-24 rounded-full overflow-hidden mb-3 bg-white p-2 shadow-sm transition-all group-hover:shadow-md">
        <div className="relative h-full w-full rounded-full overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={category.name}
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
      </div>
      <h3 className="font-medium text-sm">{category.name}</h3>
      {category.productCount !== undefined && (
        <p className="text-xs text-muted-foreground">{category.productCount} products</p>
      )}
    </Link>
  )
}
