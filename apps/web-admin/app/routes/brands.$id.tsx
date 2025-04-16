import type { MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { db } from "@workspace/db/src"
import { brands } from "@workspace/db/src/schema"
import { eq } from "drizzle-orm"
import { getBrand } from "~/action/brand"
import { BrandForm } from "~/components/brands/brand-form"
import MainLayout from "~/layouts/MainLayout"

export const meta: MetaFunction = () => {
  return [
    { title: "Brand Edit - SERVEMED" },
  ];
};

export default function EditBrandPage({ params }: { params: { id: string } }) {
  const { brand } = useLoaderData<typeof loader>()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Brand</h1>
          <p className="text-muted-foreground">Update brand information</p>
        </div>

        <BrandForm brand={brand} />
      </div>
    </MainLayout>
  )
}

export async function loader({ params }: { params: { id: string } }) {
  const brandId = Number.parseInt(params.id)

  if (Number.isNaN(brandId)) {
    throw new Response("Invalid brand ID", { status: 400 })
  }

  const brand = await getBrand(brandId)

  if (!brand) {
    throw new Response("Brand not found", { status: 404 })
  }

  return { brand }
}
