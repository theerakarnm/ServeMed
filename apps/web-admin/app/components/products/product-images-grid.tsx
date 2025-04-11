"use client"

import { useState } from "react"
import { Edit, Trash, Star, StarOff, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { toast } from 'sonner'

interface ProductImage {
  imageId: number
  productId: number
  imageUrl: string
  altText: string | null
  displayOrder: number
  isThumbnail: boolean
}

export function ProductImagesGrid({ images, productId }: { images: ProductImage[]; productId: number }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSetThumbnail = async (imageId: number) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}/set-thumbnail`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to set thumbnail")
      }

      toast('The product thumbnail has been updated successfully.')

      // In a real app, we would refresh the data here
    } catch (error) {
      toast('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReorder = async (imageId: number, direction: "up" | "down") => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder image")
      }

      toast('The image order has been updated successfully.')

      // In a real app, we would refresh the data here
    } catch (error) {
      toast('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      toast('The image has been deleted successfully.')

      // In a real app, we would refresh the data here
    } catch (error) {
      toast('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.length === 0 ? (
        <div className="col-span-full text-center p-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No images found. Add your first image.</p>
        </div>
      ) : (
        images.map((image) => (
          <Card key={image.imageId} className={image.isThumbnail ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4 rounded-md overflow-hidden border">
                {/* <Image
                  src={image.imageUrl || }
                  alt={image.altText || "Product image"}
                  fill
                  className="object-cover"
                /> */}
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.altText || "Image"}
                  className='object-cover'
                />
                {image.isThumbnail && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                    Thumbnail
                  </div>
                )}
              </div>

              <div className="text-sm mb-4">
                <p className="font-medium truncate">{image.altText || "No alt text"}</p>
                <p className="text-muted-foreground">Order: {image.displayOrder}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading || image.isThumbnail}
                  onClick={() => handleSetThumbnail(image.imageId)}
                >
                  {image.isThumbnail ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading || image.displayOrder === 0}
                  onClick={() => handleReorder(image.imageId, "up")}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading || image.displayOrder === images.length - 1}
                  onClick={() => handleReorder(image.imageId, "down")}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm" disabled={isLoading}>
                  <Edit className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the image.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(image.imageId)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
