import Footer from '~/components/footer'
import Header from '~/components/header'

type Props = {
  children: React.ReactNode
}

const Wrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default Wrapper
