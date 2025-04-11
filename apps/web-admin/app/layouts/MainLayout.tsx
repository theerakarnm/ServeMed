import { Sidebar } from '~/components/Sidebar'

type Props = {
  children: React.ReactNode
  className?: string
}

const MainLayout = (props: Props) => {
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
