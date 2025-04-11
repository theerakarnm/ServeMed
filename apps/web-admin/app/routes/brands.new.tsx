import { BrandForm } from "~/components/brands/brand-form";
import MainLayout from "~/layouts/MainLayout";
import type { MetaFunction } from "@remix-run/node"

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
