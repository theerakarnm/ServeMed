import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { Link, useLoaderData } from "@remix-run/react"
import { db } from "@workspace/db/src"
import { brands } from "@workspace/db/src/schema"
import { BrandsTable } from "~/components/brands/brand-table"
import MainLayout from "~/layouts/MainLayout"
import { getBrand, getBrands } from "~/action/brand"

export default function BrandsPage() {
  const { brandList } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
            <p className="text-muted-foreground">Manage your product brands</p>
          </div>
          <Link to="/brands/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </Link>
        </div>

        <BrandsTable data={brandList} />
      </div>
    </MainLayout>
  )
}

export async function loader() {
  const brandList = await getBrands()
  return {
    brandList
  }
}
