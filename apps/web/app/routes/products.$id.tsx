import { useLoaderData, json, type MetaFunction } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import ProductGallery from "~/components/features/products/product-gallery";
import ProductInfo from "~/components/features/products/product-info";
import ProductTabs from "~/components/features/products/product-tabs";
import RelatedProducts from "~/components/features/products/related-products";
import RelatedCategories from "~/components/features/products/related-categories";
import { getRelatedProducts, getProductCategories } from "~/data/product";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Wrapper from "~/layouts/Wrapper";
import { categories } from "../../../../packages/db/src/schema";
import { getProductById } from "~/services/products";

// Remix loader function to fetch data
export async function loader({ params }: LoaderFunctionArgs) {
  const productId = Number.parseInt(params.productId as string);
  const product = await getProductById(productId);

  const [relatedProducts, relatedCategories] = await Promise.all([
    getRelatedProducts(productId),
    getProductCategories(productId),
  ]);


  // if (!product) {
  //   throw new Response("Product not found", { status: 404 });
  // }

  return { product, productId, relatedProducts, relatedCategories };
}

// Remix meta function for page metadata
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [
      { title: "Product Not Found" },
      { name: "description", content: "The requested product could not be found." },
    ];
  }

  return [
    { title: `${data.product.name} | ServeMed` },
    {
      name: "description",
      content:
        data.product.detailedDescription || "Premium health supplement from ServeMed",
    },
  ];
};

export default function ProductPage() {
  const { product, productId, relatedProducts, relatedCategories } = useLoaderData<typeof loader>();

  return (
    <Wrapper>
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <ProductGallery productId={productId} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Tabs (Details, Ingredients, Questions, Reviews) */}
        <ProductTabs productId={productId} product={product} />

        {/* Related Products */}
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <RelatedProducts productId={productId} products={relatedProducts} />
        </section>

        {/* Related Categories */}
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6">Related Categories</h2>
          <RelatedCategories productId={productId} categories={relatedCategories} />
        </section>
      </div>
    </Wrapper>
  );
}

// Optional ErrorBoundary component for handling errors
export function ErrorBoundary() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
      <p>The requested product could not be found.</p>
    </div>
  );
}
