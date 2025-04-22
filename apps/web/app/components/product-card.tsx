import { ShoppingCart, Star } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Link } from "@remix-run/react"

interface ProductCardProps {
  product: {
    productId: number
    name: string
    brandId: number
    brandName?: string
    overallRating?: number
    totalReviews?: number
    price?: number
    currency?: string
    imageUrl?: string
    isuraVerified?: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Default values for missing properties
  const imageUrl = product.imageUrl || "/placeholder.svg?height=300&width=300"
  const price = product.price || 29.99
  const currency = product.currency || "USD"
  const rating = product.overallRating || 4.5
  const reviews = product.totalReviews || 0

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.productId}`}>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="object-cover transition-transform hover:scale-105"
          />
        </Link>

        {product.isuraVerified && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Verified
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-0">
        <div className="text-sm text-muted-foreground">{product.brandName || "Brand"}</div>
        <Link to={`/products/${product.productId}`} className="hover:underline">
          <h3 className="font-semibold line-clamp-2 h-12">{product.name}</h3>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center space-x-1 mb-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
        </div>

        <div className="font-bold">
          {currency === "USD" ? "$" : currency} {price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
