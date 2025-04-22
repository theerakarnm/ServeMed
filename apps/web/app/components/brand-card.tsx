import { Link } from "@remix-run/react"
import { Card, CardContent } from "@workspace/ui/components/card"

interface BrandCardProps {
  brand: {
    brandId: number
    name: string
    logoUrl?: string
  }
}

export default function BrandCard({ brand }: BrandCardProps) {
  const logoUrl = brand.logoUrl || "/placeholder.svg?height=80&width=160"

  return (
    <Link to={`/brands/${brand.brandId}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md border-muted/50">
        <div className="h-24 flex items-center justify-center p-4 bg-white">
          <div className="relative h-16 w-full">
            <img src={logoUrl || "/placeholder.svg"} alt={brand.name} className="object-contain" />
          </div>
        </div>
        <CardContent className="p-3 bg-muted/10">
          <h3 className="text-sm font-medium text-center truncate">{brand.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
