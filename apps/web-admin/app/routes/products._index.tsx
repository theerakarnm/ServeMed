import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { eq } from "drizzle-orm"
import { db } from "@workspace/db/src"
import { brands, products } from "@workspace/db/src/schema"
import { Link, useLoaderData } from "@remix-run/react"
import { ProductsTable } from "~/components/products/product-table"
import MainLayout from "~/layouts/MainLayout"
import { getProduct, getProducts } from "~/action/product"

export default function ProductsPage() {
  const { productList } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Link to="/products/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <ProductsTable data={productList} />
      </div>
    </MainLayout>
  )
}

export async function loader() {
  // const data = await db.select().from(categories)
  // Get products with brand information
  // const data = await db
  //   .select({
  //     productId: products.productId,
  //     name: products.name,
  //     brandId: products.brandId,
  //     brandName: brands.name,
  //     overallRating: products.overallRating,
  //     totalReviews: products.totalReviews,
  //     isuraVerified: products.isuraVerified,
  //     dateFirstAvailable: products.dateFirstAvailable,
  //   })
  //   .from(products)
  //   .leftJoin(brands, eq(products.brandId, brands.brandId))

  const products = await getProducts()
  return { productList: products }
}

