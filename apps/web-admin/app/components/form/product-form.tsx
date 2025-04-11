"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { ProductFormData } from "~/interfaces/product"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z
    .string()
    .nullable()
    .optional(),
  price: z
    .string()
    .min(1, "Price is required"),
  discountPrice: z
    .string()
    .optional(),
  stockQuantity: z
    .string()
    .min(1, "Stock quantity is required"),
  description: z.string().optional(),
  expiryDate: z.string().optional(),
  manufacturingDate: z.string().optional(),
  batchNumber: z.string().optional(),
  weight: z
    .string()
    .optional(),
  dimensions: z.string().optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().default(true),
  sku: z.string().optional(),
  upc: z.string().optional(),
  vsCode: z.string().optional(),
  categoryIds: z.array(z.string()),
})

type FormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: ProductFormData
  brands: { brandId: number; name: string }[]
  categories: { categoryId: number; name: string }[]
  onSubmit?: (formData: FormData) => Promise<{ success: boolean; errors?: unknown }>
  submitButtonText: string
}

export function ProductForm({ initialData, brands, categories, onSubmit, submitButtonText }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Transform initialData for the form
  const defaultValues: Partial<FormData> = initialData
    ? {
      name: initialData.name,
      brandId: initialData.brandId ? initialData.brandId?.toString() : undefined,
      price: initialData.price.toString(),
      discountPrice: initialData.discountPrice ? initialData.discountPrice.toString() : "",
      stockQuantity: initialData.stockQuantity.toString(),
      description: initialData.description || "",
      expiryDate: initialData.expiryDate || "",
      manufacturingDate: initialData.manufacturingDate || "",
      batchNumber: initialData.batchNumber || "",
      weight: initialData.weight ? String(initialData.weight) : "",
      dimensions: initialData.dimensions || "",
      imageUrl: initialData.imageUrl || "",
      isAvailable: initialData.isAvailable,
      sku: initialData.sku || "",
      upc: initialData.upc || "",
      vsCode: initialData.vsCode || "",
      categoryIds: initialData.categoryIds?.map(String) || [],
    }
    : {
      name: "",
      brandId: null,
      price: "",
      discountPrice: "",
      stockQuantity: "0",
      description: "",
      expiryDate: "",
      manufacturingDate: "",
      batchNumber: "",
      weight: "",
      dimensions: "",
      imageUrl: "",
      isAvailable: true,
      sku: "",
      upc: "",
      vsCode: "",
      categoryIds: [],
    }

  const form = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await onSubmit?.(data)

      if (!result?.success) {
        // Handle validation errors
        if (result?.errors) {
          // Object.entries(result.errors).forEach(([key, value]) => {
          //   if (key === "_form") {
          //     // Handle form-level errors
          //     form.setError("root", {
          //       type: "manual",
          //       message: Array.isArray(value) ? value[0] : String(value),
          //     })
          //   } else {
          //     // Handle field-level errors
          //     form.setError(key as any, {
          //       type: "manual",
          //       message: Array.isArray(value) ? value[0] : String(value),
          //     })
          //   }
          // })
        }
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.brandId} value={String(brand.brandId)}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Categories</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <FormField
                        key={category.categoryId}
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.categoryId}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(String(category.categoryId))}
                                  onCheckedChange={(checked) => {
                                    const categoryId = String(category.categoryId)
                                    const updatedCategories = checked
                                      ? [...field.value, categoryId]
                                      : field.value.filter((id) => id !== categoryId)
                                    field.onChange(updatedCategories)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{category.name}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPC</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vsCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VS Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10x20x30 cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="manufacturingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturing Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for Purchase</FormLabel>
                    <FormDescription>This product will be shown as available in the store.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
          <Button type="button" variant="outline" onClick={() => { return }}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

