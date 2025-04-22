import { db } from "@workspace/db/src"
import { useLoaderData } from "@remix-run/react"
import { ProductForm } from "~/components/products/product-form"
import MainLayout from "~/layouts/MainLayout"
import { getBrands } from "~/action/brand"
import { getCategories } from "~/action/category"

export default function NewProductPage() {
  const { brandsData, categoriesData } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
          <p className="text-muted-foreground">Create a new product in the system</p>
        </div>

        <ProductForm brands={brandsData} categories={categoriesData} />
      </div>
    </MainLayout>
  )
}

export async function loader() {
  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories()
  ])

  return {
    brandsData: brands,
    categoriesData: categories,
  }
}
