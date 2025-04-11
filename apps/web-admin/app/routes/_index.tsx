import type { MetaFunction } from "@remix-run/node";

// import { getBrands, getCategories } from "@/lib/products"
// import { createProductAction } from "../../actions/product-actions"
import { ProductForm } from "~/components/form/product-form";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default async function NewProductPage() {
  // const [brands, categories] = await Promise.all([getBrands(), getCategories()])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <ProductForm
        brands={[]}
        categories={[]}
        // onSubmit={async (data) => {
        // "use server"
        // const formData = new FormData()

        // // Add all form fields to FormData
        // Object.entries(data).forEach(([key, value]) => {
        //   if (key === "categoryIds" && Array.isArray(value)) {
        //     value.forEach((categoryId) => {
        //       formData.append("categoryIds", categoryId)
        //     })
        //   } else if (value !== null && value !== undefined) {
        //     formData.append(key, String(value))
        //   }
        // })

        // // Set isAvailable checkbox
        // if (data.isAvailable) {
        //   formData.set("isAvailable", "on")
        // }

        // return createProductAction(formData)
        // }}
        submitButtonText="Create Product"
      />
    </div>
  )
}

