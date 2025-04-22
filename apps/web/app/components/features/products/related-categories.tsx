import { Link } from "@remix-run/react"
import { Badge } from "@workspace/ui/components/badge"
import type { getProductCategories } from "~/data/product"

interface RelatedCategoriesProps {
  productId: number,
  categories: Awaited<ReturnType<typeof getProductCategories>>
}

export default function RelatedCategories({ productId, categories }: RelatedCategoriesProps) {
  if (categories.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No categories found.</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link key={category.categoryId} to={`/categories/${category.categoryId}`}>
          <Badge variant="outline" className="text-sm py-1.5 px-3 hover:bg-muted">
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
