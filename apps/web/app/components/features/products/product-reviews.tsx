import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react'
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"
import { useReviews } from "~/hooks/use-product-review"
import { formatDistanceToNow } from "date-fns"

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { reviews, reviewStats, isLoading } = useReviews(productId)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted h-16" />
            <CardContent className="bg-muted/50 h-24 mt-2" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{reviewStats.averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(reviewStats.averageRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                      }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Based on {reviewStats.totalReviews} reviews</div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewStats.ratingCounts[rating] || 0
                const percentage = reviewStats.totalReviews
                  ? Math.round((count / reviewStats.totalReviews) * 100)
                  : 0

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <Button
                      variant={selectedRating === rating ? "default" : "outline"}
                      size="sm"
                      className="w-16"
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    >
                      {rating} <Star className="h-3 w-3 ml-1" />
                    </Button>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-sm w-12 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Highlights */}
      {reviewStats.highlights && reviewStats.highlights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {reviewStats.highlights.map((highlight: any, index: number) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedRating
              ? `No ${selectedRating}-star reviews yet.`
              : "No reviews yet. Be the first to review this product!"}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.reviewId}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.reviewDate), { addSuffix: true })}
                  </div>
                </div>
                <h4 className="font-semibold">{review.reviewTitle || "Untitled Review"}</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">{review.reviewText}</div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    {review.images.map((image: any, index: number) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <Button
                            className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0"
                            onClick={() => setSelectedImage(image.imageUrl)}
                          >
                            <img
                              src={image.imageUrl || "/placeholder.svg?height=64&width=64"}
                              alt={image.altText || `Review image ${index + 1}`}
                              className="object-cover"
                            />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <div className="relative aspect-square">
                            <img
                              src={image.imageUrl || "/placeholder.svg?height=800&width=800"}
                              alt={image.altText || "Review image"}
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-xs">
                    {review.isVerifiedPurchase && (
                      <Badge variant="outline" className="mr-2">
                        Verified Purchase
                      </Badge>
                    )}
                    {review.reviewerLocation && (
                      <span className="text-muted-foreground">{review.reviewerLocation}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {review.helpfulVotes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {review.notHelpfulVotes}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Write a Review Button */}
      <div className="flex justify-center pt-4">
        <Button>Write a Review</Button>
      </div>
    </div>
  )
}
