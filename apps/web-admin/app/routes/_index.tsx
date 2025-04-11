import type { MetaFunction } from "@remix-run/node";

// import { getBrands, getCategories } from "@/lib/products"
// import { createProductAction } from "../../actions/product-actions"

export const meta: MetaFunction = () => {
  return [
    { title: "SERVEMED - ADMIN PORTAL" },
    { name: "description", content: "Welcome to admin portal" },
  ];
};

export default function NewProductPage() {
  // const [brands, categories] = await Promise.all([getBrands(), getCategories()])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>


    </div>
  )
}

