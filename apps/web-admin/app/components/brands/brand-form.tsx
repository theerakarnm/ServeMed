"use client"

import { useEffect, useState } from "react"
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
import { useActionData, useSubmit } from "@remix-run/react"
import { HTTP_STATUS } from "~/config/http"

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
})

type BrandFormValues = z.infer<typeof brandSchema>

export interface Brand {
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
  const submit = useSubmit()
  const actionData = useActionData<{
    status: HTTP_STATUS
  }>()

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      logoUrl: brand?.logoUrl || "",
      description: brand?.description || "",
    },
  })

  useEffect(() => {
    if (!actionData) return
    if ([
      HTTP_STATUS.OK.toString(),
      HTTP_STATUS.CREATED.toString(),
    ].includes(actionData.status.toString())) {
      toast("Brand saved successfully.")

      jnavigate({
        path: "/brands",
        target: "_self",
      })
    }
  }, [actionData])

  async function onSubmit(data: BrandFormValues) {

    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify({
        ...data,
        brandId: brand?.brandId,
      }))

      submit(formData, {
        action: '/brands/new',
        method: brand ? "PUT" : "POST",
      })

      // toast(brand ? "Your brand has been updated successfully." : "Your brand has been created successfully.",)
    } catch (error) {
      toast('Something went wrong. Please try again.')
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
