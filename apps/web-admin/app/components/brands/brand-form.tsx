"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Trash2, PlusCircle } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"

const brandItemSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
})

const brandSchema = z.object({
  brands: z.array(brandItemSchema).min(1, "At least one brand is required"),
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

export function BrandForm({ brand }: BrandFormProps = {}) {
  const actionData = useActionData<{
    status: number
  }>()
  const submit = useSubmit()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brands: brand
        ? [
          {
            name: brand.name,
            logoUrl: brand.logoUrl || "",
            description: brand.description || "",
          },
        ]
        : [
          {
            name: "",
            logoUrl: "",
            description: "",
          },
        ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "brands",
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
        brands: data.brands,
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
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Brand {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name={`brands.${index}.name`}
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
                  name={`brands.${index}.logoUrl`}
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
                  name={`brands.${index}.description`}
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

                {index < fields.length - 1 && <Separator className="my-6" />}
              </div>
            ))}

            {!brand && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    logoUrl: "",
                    description: "",
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Brand
              </Button>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : brand ? "Update Brand" : "Create Brands"}
              </Button>
              <Button type="button" variant="outline" onClick={() => jnavigate({ path: "/brands", target: "_self" })}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
