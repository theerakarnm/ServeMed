import { BrandForm } from "~/components/brands/brand-form";
import MainLayout from "~/layouts/MainLayout";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { HTTP_STATUS } from "~/config/http";
import { type Category, CategoryForm } from "~/components/categories/category-form";
import { createCategories, getCategories, updateCategory } from "~/action/category";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Category Create - SERVEMED" },
  ];
};

export default function NewCategoryPage() {
  const { categories } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Brand</h1>
          <p className="text-muted-foreground">Create a new brand in the system</p>
        </div>
        <CategoryForm categories={categories} />
      </div>
    </MainLayout>
  )
}

export async function loader() {
  const categories = await getCategories()

  if (!categories) {
    throw new Response("Categories not found", { status: 404 })
  }

  return { categories }
}


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = formData.get("data")

  if (!data) {
    throw new Response("Invalid data", { status: HTTP_STATUS.BAD_REQUEST })
  }

  try {
    const parsedData = JSON.parse(data.toString()) as {
      categories: Category[]
      categoryId?: number
    }

    if (parsedData.categoryId) {
      if (!parsedData.categories[0]) {
        throw new Response("Invalid data", { status: HTTP_STATUS.BAD_REQUEST })
      }
      await updateCategory(parsedData.categoryId, parsedData.categories[0])

      return {
        status: HTTP_STATUS.OK
      }
    }

    await createCategories(parsedData.categories)

    return {
      status: HTTP_STATUS.CREATED
    }
  } catch (error) {
    throw new Response("Invalid JSON data", { status: HTTP_STATUS.BAD_REQUEST })
  }
}
