"use client"

import { useState, useEffect } from "react"

export function useProductVariants(productId: number) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [variants, setVariants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchVariants() {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/products/${productId}/variants`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockVariants = [
          {
            variantId: 1,
            productId,
            packageDescription: "60 Capsules",
            price: 19.99,
            currency: "USD",
            listPrice: 24.99,
            servingSize: "1 Capsule",
            servingsPerContainer: 60,
            isInStock: true
          },
          {
            variantId: 2,
            productId,
            packageDescription: "120 Capsules",
            price: 34.99,
            currency: "USD",
            listPrice: 39.99,
            servingSize: "1 Capsule",
            servingsPerContainer: 120,
            isInStock: true
          },
          {
            variantId: 3,
            productId,
            packageDescription: "180 Capsules",
            price: 49.99,
            currency: "USD",
            listPrice: 59.99,
            servingSize: "1 Capsule",
            servingsPerContainer: 180,
            isInStock: false
          }
        ]

        setVariants(mockVariants)
      } catch (error) {
        console.error("Error fetching product variants:", error)
        setVariants([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVariants()
  }, [productId])

  return { variants, isLoading }
}
