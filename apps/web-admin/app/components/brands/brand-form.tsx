"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"
import { jnavigate } from "@workspace/ui/lib/utils"

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
})

type BrandFormValues = z.infer<typeof brandSchema>

interface Brand {
  brandId: number
  name: string
  logoUrl: string | null
  description: string | null
}

interface BrandFormProps {
  brand?: Brand
}

export function BrandForm({ brand }: BrandFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      logoUrl: brand?.logoUrl || "",
      description: brand?.description || "",
    },
  })

  async function onSubmit(data: BrandFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/brands", {
        method: brand ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          brandId: brand?.brandId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save brand")
      }

      toast(brand ? "Your brand has been updated successfully." : "Your brand has been created successfully.",)

      jnavigate({
        path: "/brands",
        target: "_self",
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormDescription>The name of the brand as it will appear throughout the system.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>A URL to the brand's logo image.</FormDescription>
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
                    <Textarea placeholder="Enter brand description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>A brief description of the brand.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                jnavigate({
                  path: "/brands",
                  target: "_self",
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
