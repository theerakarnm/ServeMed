import { useState } from "react"
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"
import { useProductImages } from "@/hooks/use-product-images"

interface ProductGalleryProps {
  productId: number
}

export default function ProductGallery({ productId }: ProductGalleryProps) {
  const { images, isLoading } = useProductImages(productId)
  const [currentImage, setCurrentImage] = useState(0)

  // If loading or no images, show placeholder
  if (isLoading || images.length === 0) {
    return (
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground">Loading images...</span>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm"
            >
              <Expand className="h-4 w-4" />
              <span className="sr-only">Zoom</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-square">
              <Image
                src={images[currentImage].imageUrl || "/placeholder.svg?height=800&width=800"}
                alt={images[currentImage].altText || "Product image"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </DialogContent>
        </Dialog>

        <Image
          src={images[currentImage].imageUrl || "/placeholder.svg?height=600&width=600"}
          alt={images[currentImage].altText || "Product image"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.imageId}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden border-2",
                currentImage === index ? "border-primary" : "border-muted"
              )}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={image.imageUrl || "/placeholder.svg?height=80&width=80"}
                alt={image.altText || `Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
