import { eq } from "drizzle-orm"
import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { Link, useLoaderData } from "@remix-run/react"
import { VariantsTable } from "~/components/products/product-variants-table";

export default function ProductVariantsPage({ params }: { params: { id: string } }) {
  const {
    variants,
    product
  } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
          <p className="text-muted-foreground">
            Manage variants for <span className="font-medium">{product.name}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Link to={`/products/${product.productId}`}>
            <Button variant="outline">Back to Product</Button>
          </Link>
          <Link to={`/products/${product.productId}/variants/new`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </Link>
        </div>
      </div>

      <VariantsTable data={variants} productId={product.productId} />
    </div>
  )
}
export async function loader({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)

  if (Number.isNaN(productId)) {
    throw new Response("Product not found", { status: 404 })
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
    throw new Response("Product not found", { status: 404 })
  }

  // const variants = await db.select().from(productVariants).where(eq(productVariants.productId, productId))

  return { product, variants: [] }
}
