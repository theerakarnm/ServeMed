import ProductCard from "~/components/product-card"
import type { getRelatedProducts } from "~/data/product"

interface RelatedProductsProps {
  productId: number,
  products: Awaited<ReturnType<typeof getRelatedProducts>>
}

export default function RelatedProducts({ productId, products }: RelatedProductsProps) {
  if (products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No related products found.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}
