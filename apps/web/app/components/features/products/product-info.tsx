import { useState } from "react"
import { ShoppingCart, Heart, Award, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from "@workspace/ui/components/button"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { useProductVariants } from "~/hooks/use-product-variants"
import { formatCurrency } from "@workspace/ui/lib/formatter"
import { toast } from "sonner"
import { Link } from "@remix-run/react"

interface ProductInfoProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any // Using any for now, would be properly typed in a real app
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { variants, isLoading } = useProductVariants(product.productId)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast('Please select a product variant')
      return
    }

    toast(`${product.name} (${variants.find(v => v.variantId.toString() === selectedVariant)?.packageDescription}) x ${quantity}`)
  }

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast("Please select a product variant")
      return
    }

    // In a real app, this would navigate to checkout
    toast("This would navigate to the checkout page in a real app")
  }

  const currentVariant = selectedVariant
    ? variants.find(v => v.variantId.toString() === selectedVariant)
    : variants[0]

  return (
    <div className="space-y-6">
      {/* Brand and Product Name */}
      <div>
        <Link
          to={`/brands/${product.brandId}`}
          className="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          {product.brandName}
        </Link>
        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
      </div>

      {/* Ratings */}
      <div className="flex items-center space-x-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
            <svg
              key={star}
              className={`h-5 w-5 ${star <= Math.round(product.overallRating || 0) ? "fill-primary" : "fill-muted stroke-muted-foreground"
                }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <Link to="#reviews" className="text-sm text-muted-foreground hover:text-primary">
          {product.overallRating?.toFixed(1) || "0.0"} ({product.totalReviews || 0} reviews)
        </Link>
        <Link to="#questions" className="text-sm text-muted-foreground hover:text-primary">
          {product.totalQuestions || 0} questions
        </Link>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isuraVerified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Isura Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">This product has been verified by Isura for quality and purity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {product.nonGmoDocumentation && (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Non-GMO
          </Badge>
        )}

        {product.massSpecLabTested && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            Lab Tested
          </Badge>
        )}
      </div>

      {/* Price and Variants */}
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {currentVariant ? formatCurrency(currentVariant.price, currentVariant.currency) : "Select a variant"}
          </span>
          {currentVariant?.listPrice && currentVariant.price < currentVariant.listPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatCurrency(currentVariant.listPrice, currentVariant.currency)}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="variant">Package Size</Label>
            {isLoading && <span className="text-sm text-muted-foreground">Loading variants...</span>}
          </div>

          {!isLoading && variants.length > 0 && (
            <RadioGroup
              id="variant"
              value={selectedVariant || variants[0].variantId.toString()}
              onValueChange={setSelectedVariant}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {variants.map((variant) => (
                <div key={variant.variantId}>
                  <RadioGroupItem
                    value={variant.variantId.toString()}
                    id={`variant-${variant.variantId}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`variant-${variant.variantId}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-semibold">{variant.packageDescription}</span>
                    <span className="text-sm font-medium">{formatCurrency(variant.price, variant.currency)}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Quantity */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="quantity">Quantity:</Label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Status */}
      {currentVariant && (
        <div className="flex items-center space-x-2">
          {currentVariant.isInStock ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!currentVariant?.isInStock}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!currentVariant?.isInStock}
        >
          Buy Now
        </Button>
        <Button size="lg" variant="outline" className="sm:flex-none">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to Wishlist</span>
        </Button>
      </div>

      <Separator />

      {/* Product Highlights */}
      <div className="space-y-3">
        <h3 className="font-medium">Product Highlights</h3>
        <ul className="space-y-2">
          {product.baseDescription && (
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{product.baseDescription}</span>
            </li>
          )}
          {currentVariant?.servingSize && (
            <li className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Serving Size: {currentVariant.servingSize}</span>
            </li>
          )}
          {currentVariant?.servingsPerContainer && (
            <li className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Servings Per Container: {currentVariant.servingsPerContainer}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
