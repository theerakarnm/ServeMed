import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { Link, useLoaderData } from "@remix-run/react"
import { CategoriesTable } from "~/components/categories/category-table"
import MainLayout from "~/layouts/MainLayout"
import { getCategories } from "~/action/category"

export default function CategoriesPage() {
  const { categoryList } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your product categories</p>
          </div>
          <Link to="/categories/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>

        <CategoriesTable data={categoryList} />
      </div>
    </MainLayout>
  )
}

export async function loader() {
  const categoryList = await getCategories()
  return { categoryList }
}
