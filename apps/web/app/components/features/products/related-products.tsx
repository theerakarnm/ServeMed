import ProductCard from "~/components/product-card"
import { getRelatedProducts } from "~/data/product"

interface RelatedProductsProps {
  productId: number
}

export default async function RelatedProducts({ productId }: RelatedProductsProps) {
  const products = await getRelatedProducts(productId)

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
