import { useLoaderData } from "@remix-run/react"
import { db } from "@workspace/db/src"
import { productCategories, products } from "@workspace/db/src/schema"
import { eq } from "drizzle-orm"
import { ProductForm } from "~/components/products/product-form"
import MainLayout from "~/layouts/MainLayout"

export default function EditProductPage({ params }: { params: { id: string } }) {

  const {
    product,
    selectedCategoryIds,
    brandsData,
    categoriesData,
  } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>

        <ProductForm
          product={product}
          brands={brandsData}
          categories={categoriesData}
          selectedCategoryIds={selectedCategoryIds}
        />
      </div>
    </MainLayout>
  )
}

export async function loader({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)

  if (Number.isNaN(productId)) {
    throw new Response("Brand not found", { status: 404 })
  }

  // const product = await db.query.products.findFirst({
  //   where: eq(products.productId, productId),
  // })

  const product = {
    productId: 1,
    brandId: 101,
    name: "Organic Vitamin C Supplement",
    baseDescription: "A high-quality organic vitamin C supplement.",
    overallRating: 4.75,
    totalReviews: 120,
    totalQuestions: 15,
    dateFirstAvailable: new Date(),
    manufacturerWebsiteUrl: "https://example.com/vitamin-c",
    isuraVerified: true,
    nonGmoDocumentation: true,
    massSpecLabTested: true,
    detailedDescription:
      "This organic vitamin C supplement is derived from natural sources and is designed to support immune health and overall wellness.",
    suggestedUse: "Take one capsule daily with a meal or as directed by your healthcare provider.",
    otherIngredients: "Vegetable cellulose (capsule), organic rice flour.",
    warnings: "Keep out of reach of children. Consult your healthcare provider before use.",
    disclaimer: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.",
  }

  if (!product) {
    throw new Response("Brand not found", { status: 404 })
  }

  // Get product categories
  // const productCategoriesData = await db
  //   .select({
  //     categoryId: productCategories.categoryId,
  //   })
  //   .from(productCategories)
  //   .where(eq(productCategories.productId, productId))
  const productCategoriesData = [{
    categoryId: 1
  }]

  const selectedCategoryIds = productCategoriesData.map((pc) => pc.categoryId)

  // const brandsData = await db.select().from(brands)
  // const categoriesData = await db.select().from(categories)

  return {
    product,
    selectedCategoryIds,
    brandsData: [],
    categoriesData: [{
      categoryId: 1,
      name: 'Supplement',
      parentCategoryId: null,
      description: 'supplement'
    }],
  }

}
