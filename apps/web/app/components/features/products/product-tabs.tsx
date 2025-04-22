"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import ProductOverview from "~/components/features/products/product-overview"
import ProductIngredients from "~/components/features/products/product-ingredients"
import ProductQuestions from "~/components/features/products/product-questions"
import ProductReviews from "~/components/features/products/product-reviews"

interface ProductTabsProps {
  productId: number
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any // Using any for now, would be properly typed in a real app
}

export default function ProductTabs({ productId, product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="questions">Questions ({product.totalQuestions || 0})</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.totalReviews || 0})</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <ProductOverview product={product} />
      </TabsContent>
      <TabsContent value="ingredients">
        <ProductIngredients product={product} />
      </TabsContent>
      <TabsContent value="questions">
        <ProductQuestions productId={productId} />
      </TabsContent>
      <TabsContent value="reviews">
        <ProductReviews productId={productId} />
      </TabsContent>
    </Tabs>
  )
}
