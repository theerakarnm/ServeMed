import { Sidebar } from '~/components/Sidebar'
import { createAuthClient } from "better-auth/react"
const { useSession } = createAuthClient()
import Loader from "@workspace/ui/components/Loader"
import { useEffect } from "react";
import { jnavigate } from "@workspace/ui/lib/utils";

type Props = {
  children: React.ReactNode
  className?: string
}

const MainLayout = (props: Props) => {

  const {
    data: session,
    isPending, //loading state
  } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  useEffect(() => {
    if (!session && !isPending) {
      jnavigate({
        path: "/sign-in",
        target: "_self",
      })
    }
  }, [session, isPending])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{props.children}</main>
      </div>
    </div>
  )
}

export default MainLayout
