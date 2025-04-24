import { Suspense } from "react"
import { ArrowRight, ShoppingBag, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  getFeaturedProducts,
  getTopCategories,
  getFeaturedBrands,
  getTopRankedProducts,
  getNewArrivals,
} from "~/data/product"
import HeroSection from "~/components/hero-section"
import ProductCard from "~/components/product-card"
import CategoryCard from "~/components/category-card"
import BrandCard from "~/components/brand-card"
import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { categories, products } from '../../../../packages/db/src/schema';
import Wrapper from "~/layouts/Wrapper"
import { UrlBuilder } from "~/lib/url_builder"
import HttpClient from "~/lib/http_client"

export default function HomePage() {
  const data = useLoaderData<typeof loader>()
  return (
    <Wrapper>
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
                <Link to="/categories" className="flex items-center text-primary hover:underline">
                  View all categories <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <TopCategories categories={data.topCategories} />
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
                <Link to="/products" className="flex items-center text-primary hover:underline">
                  View all products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <Suspense fallback={<ProductSkeleton />}>
                <FeaturedProducts products={data.featuredProducts} />
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
                <Link to="/brands" className="flex items-center text-primary hover:underline">
                  View all brands <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <Suspense fallback={<BrandSkeleton />}>
                <FeaturedBrands brands={data.featuredBrands} />
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
                <Link to="/rankings" className="flex items-center text-primary hover:underline">
                  View all rankings <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <Suspense fallback={<ProductSkeleton />}>
                <TopRankedProducts products={data.topRankedProducts} />
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
                <Link to="/new-arrivals" className="flex items-center text-primary hover:underline">
                  View all new arrivals <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <Suspense fallback={<ProductSkeleton />}>
                <NewArrivals products={data.newArrivals} />
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
    </Wrapper>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const [
    featuredProducts,
    topCategories,
    featuredBrands,
    topRankedProducts,
    newArrivals,
  ] = await Promise.all([
    getFeaturedProducts(),
    getTopCategories(),
    getFeaturedBrands(),
    getTopRankedProducts(),
    getNewArrivals(),
  ])

  type Product = {
    productId: number;
    name: string;
    brandId: number;
    brandName: string;
    overallRating: number;
    totalReviews: number;
    price: number;
    currency: string;
    isuraVerified: boolean;
  }

  const url = new UrlBuilder({ path: 'COMPOSE_V1_HOME' }).build()
  const httpClient = await new HttpClient(url).get<{
    data: {
      featuredProducts: Product[]
      topCategories: {
        categoryId: number;
        name: string;
        productCount: number;
      }[]
      featuredBrands: {
        brandId: number;
        name: string;
      }[]
      topRankedProducts: Product[]
      newArrivals: Product[]
    }
  }>('')

  console.log(httpClient);

  return httpClient.data;
}

function TopCategories({ categories }: { categories: Awaited<ReturnType<typeof getTopCategories>> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.categoryId} category={category} />
      ))}
    </div>
  )
}

function FeaturedProducts({ products }: { products: Awaited<ReturnType<typeof getFeaturedProducts>> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

function FeaturedBrands(
  { brands }: { brands: Awaited<ReturnType<typeof getFeaturedBrands>> }
) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {brands.map((brand) => (
        <BrandCard key={brand.brandId} brand={brand} />
      ))}
    </div>
  )
}

function TopRankedProducts(
  { products }: { products: Awaited<ReturnType<typeof getTopRankedProducts>> }
) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

function NewArrivals(
  { products }: { products: Awaited<ReturnType<typeof getNewArrivals>> }
) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

function CategorySkeleton(

) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
