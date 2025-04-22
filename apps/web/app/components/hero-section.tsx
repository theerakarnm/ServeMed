import { ArrowRight } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Link } from "@remix-run/react"

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-teal-50 z-0" />

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Premium Health Supplements
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Discover lab-tested, high-quality supplements to support your health and wellness journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                    <img
                      src={'/placeholder.svg?height=32&width=32'}
                      alt="Customer"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-medium">500+</span> happy customers
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg role="img" aria-label="product"
                    key={star}
                    className="h-5 w-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-medium">4.9/5</span> from verified reviews
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=800&width=600"
                alt="Featured supplements"
                className="object-cover"
              // priority
              />
            </div>

            {/* Floating product badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-[200px]">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Featured product"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Best Seller</p>
                  <p className="text-xs text-muted-foreground">Vitamin Complex</p>
                </div>
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  role="img" aria-label="Floating verification badge "
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
