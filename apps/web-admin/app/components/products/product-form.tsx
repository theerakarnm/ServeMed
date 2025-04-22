"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from 'sonner'
import { useLocation, useSubmit } from "@remix-run/react"
import { cn, jnavigate } from "@workspace/ui/lib/utils"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brandId: z.number({
    required_error: "Please select a brand",
  }),
  baseDescription: z.string().optional(),
  detailedDescription: z.string().optional(),
  suggestedUse: z.string().optional(),
  otherIngredients: z.string().optional(),
  warnings: z.string().optional(),
  disclaimer: z.string().optional(),
  manufacturerWebsiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  dateFirstAvailable: z.date().optional(),
  isuraVerified: z.boolean().default(false),
  nonGmoDocumentation: z.boolean().default(false),
  massSpecLabTested: z.boolean().default(false),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface Product {
  productId: number
  brandId: number
  name: string
  baseDescription: string | null
  detailedDescription: string | null
  suggestedUse: string | null
  otherIngredients: string | null
  warnings: string | null
  disclaimer: string | null
  manufacturerWebsiteUrl: string | null
  dateFirstAvailable: Date | null
  isuraVerified: boolean
  nonGmoDocumentation: boolean
  massSpecLabTested: boolean
  overallRating: number | null
  totalReviews: number
  totalQuestions: number
}

interface Brand {
  brandId: number
  name: string
}

interface Category {
  categoryId: number
  name: string
  parentCategoryId: number | null
  description: string | null
}

interface ProductFormProps {
  product?: Product
  brands: Brand[]
  categories: Category[]
  selectedCategoryIds?: number[]
}

export function ProductForm({ product, brands, categories, selectedCategoryIds = [] }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useLocation()
  const submit = useSubmit()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      brandId: product?.brandId || undefined,
      baseDescription: product?.baseDescription || "",
      detailedDescription: product?.detailedDescription || "",
      suggestedUse: product?.suggestedUse || "",
      otherIngredients: product?.otherIngredients || "",
      warnings: product?.warnings || "",
      disclaimer: product?.disclaimer || "",
      manufacturerWebsiteUrl: product?.manufacturerWebsiteUrl || "",
      dateFirstAvailable: product?.dateFirstAvailable || undefined,
      isuraVerified: product?.isuraVerified || false,
      nonGmoDocumentation: product?.nonGmoDocumentation || false,
      massSpecLabTested: product?.massSpecLabTested || false,
      categoryIds: selectedCategoryIds || [],
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    try {

      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

      submit(formData, {
        action: product ? `/products/${product.productId}` : "/products/new",
        method: product ? "PUT" : "POST",
      })

      jnavigate({
        path: '/products',
        target: '_self'
      })
    } catch (error) {
      toast('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the product as it will appear throughout the system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Brand</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value
                                ? brands.find((brand) => brand.brandId === field.value)?.name
                                : "Select brand"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search brand..." />
                            <CommandList>
                              <CommandEmpty>No brand found.</CommandEmpty>
                              <CommandGroup>
                                {brands.map((brand) => (
                                  <CommandItem
                                    value={brand.name}
                                    key={brand.brandId}
                                    onSelect={() => {
                                      form.setValue("brandId", brand.brandId)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        brand.brandId === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {brand.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>The brand that manufactures this product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baseDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a short description"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>A brief description of the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturerWebsiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>URL to the manufacturer's website.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateFirstAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date First Available</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>The date when the product first became available.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="detailedDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed product description"
                          className="min-h-[150px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>A comprehensive description of the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suggestedUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggested Use</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter suggested use instructions"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Instructions on how to use the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherIngredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Ingredients</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter other ingredients"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        List of additional ingredients not included in supplement facts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warnings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warnings</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter warnings"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Important warnings about the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disclaimer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disclaimer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter disclaimer"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Legal disclaimer for the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Categories</FormLabel>
                        <FormDescription>Select the categories this product belongs to.</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                                      checked={field.value?.includes(category.categoryId)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category.categoryId])
                                          : field.onChange(
                                            field.value?.filter((value) => value !== category.categoryId),
                                          )
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
              </TabsContent>

              <TabsContent value="certifications" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="isuraVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>ISURA Verified</FormLabel>
                        <FormDescription>Product has been verified by ISURA.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nonGmoDocumentation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Non-GMO Documentation</FormLabel>
                        <FormDescription>Product has non-GMO documentation.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="massSpecLabTested"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mass Spec Lab Tested</FormLabel>
                        <FormDescription>Product has been tested in a mass spectrometry lab.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                jnavigate({
                  path: '/products',
                  target: '_self'
                })
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
