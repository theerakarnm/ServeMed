import { type Brand, BrandForm } from "~/components/brands/brand-form";
import MainLayout from "~/layouts/MainLayout";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { createBrand, createManyBrand, updateBrand } from "~/action/brand";
import { HTTP_STATUS } from "~/config/http";

export const meta: MetaFunction = () => {
  return [
    { title: "Brand Create - SERVEMED" },
  ];
};

export default function NewBrandPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Brand</h1>
          <p className="text-muted-foreground">Create a new brand in the system</p>
        </div>
        <BrandForm />
      </div>
    </MainLayout>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = formData.get("data")

  if (!data) {
    throw new Response("Invalid data", { status: HTTP_STATUS.BAD_REQUEST })
  }

  try {
    const parsedData = JSON.parse(data.toString()) as {
      brands: Brand[]
      brandId?: number
    }

    if (parsedData.brandId) {
      if (!parsedData.brands[0]) {
        throw new Response("Invalid data", { status: HTTP_STATUS.BAD_REQUEST })
      }
      await updateBrand(parsedData.brandId, parsedData.brands[0])

      return {
        status: HTTP_STATUS.OK
      }
    }

    await createManyBrand(parsedData.brands)

    return {
      status: HTTP_STATUS.CREATED
    }
  } catch (error) {
    throw new Response("Invalid JSON data", { status: HTTP_STATUS.BAD_REQUEST })
  }
}
