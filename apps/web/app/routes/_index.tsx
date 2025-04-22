import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  getFeaturedProducts,
  getTopCategories,
  getFeaturedBrands,
  getTopRankedProducts,
  getNewArrivals,
} from "@/lib/data"
import HeroSection from "@/components/hero-section"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import BrandCard from "@/components/brand-card"

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />

        {/* Categories Section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
                <p className="text-muted-foreground mt-1">Browse our wide selection of health supplements</p>
              </div>
              <Link href="/categories" className="flex items-center text-primary hover:underline">
                View all categories <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Suspense fallback={<CategorySkeleton />}>
              <TopCategories />
            </Suspense>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
                <p className="text-muted-foreground mt-1">Our most popular health supplements</p>
              </div>
              <Link href="/products" className="flex items-center text-primary hover:underline">
                View all products <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Suspense fallback={<ProductSkeleton />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Top Brands</h2>
                <p className="text-muted-foreground mt-1">Trusted manufacturers of quality supplements</p>
              </div>
              <Link href="/brands" className="flex items-center text-primary hover:underline">
                View all brands <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Suspense fallback={<BrandSkeleton />}>
              <FeaturedBrands />
            </Suspense>
          </div>
        </section>

        {/* Top Ranked Products */}
        <section className="py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Top Ranked Products</h2>
                <p className="text-muted-foreground mt-1">Highest rated in their categories</p>
              </div>
              <Link href="/rankings" className="flex items-center text-primary hover:underline">
                View all rankings <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Suspense fallback={<ProductSkeleton />}>
              <TopRankedProducts />
            </Suspense>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">The latest additions to our catalog</p>
              </div>
              <Link href="/new-arrivals" className="flex items-center text-primary hover:underline">
                View all new arrivals <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Suspense fallback={<ProductSkeleton />}>
              <NewArrivals />
            </Suspense>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground">All products are lab-tested and verified for quality and purity</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Selection</h3>
                <p className="text-muted-foreground">Curated by health professionals to ensure effectiveness</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trending Products</h3>
                <p className="text-muted-foreground">Stay ahead with the latest and most effective supplements</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

async function TopCategories() {
  const categories = await getTopCategories()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.categoryId} category={category} />
      ))}
    </div>
  )
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

async function FeaturedBrands() {
  const brands = await getFeaturedBrands()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {brands.map((brand) => (
        <BrandCard key={brand.brandId} brand={brand} />
      ))}
    </div>
  )
}

async function TopRankedProducts() {
  const products = await getTopRankedProducts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

async function NewArrivals() {
  const products = await getNewArrivals()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-3" />
            <Skeleton className="h-4 w-24 mb-1" />
          </div>
        ))}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

function BrandSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-24 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
