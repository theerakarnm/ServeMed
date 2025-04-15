import type { MetaFunction } from "@remix-run/node";

import Loader from "@workspace/ui/components/Loader"
import { useEffect } from "react";
import { jnavigate } from "@workspace/ui/lib/utils";
import { createAuthClient } from 'better-auth/react';
import { argsSession } from "~/config";

const { useSession } = createAuthClient(argsSession)

export const meta: MetaFunction = () => {
  return [
    { title: "SERVEMED - ADMIN PORTAL" },
    { name: "description", content: "Welcome to admin portal" },
  ];
};

export default function NewProductPage() {
  const {
    data: session,
    isPending, //loading state
  } = useSession()

  useEffect(() => {
    if (!session && !isPending) {
      jnavigate({
        path: "/sign-in",
        target: "_self",
      })
    }
  }, [session, isPending])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>


    </div>
  )
}

