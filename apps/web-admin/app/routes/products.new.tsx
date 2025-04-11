import { db } from "@workspace/db/src"
import { useLoaderData } from "@remix-run/react"
import { ProductForm } from "~/components/products/product-form"

export default function NewProductPage() {
  const { brandsData, categoriesData } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground">Create a new product in the system</p>
      </div>

      <ProductForm brands={brandsData} categories={categoriesData} />
    </div>
  )
}

export async function loader() {
  // const brandsData = await db.select().from(brands)
  // const categoriesData = await db.select().from(categories)

  return {
    brandsData: [],
    categoriesData: [],
  }
}
