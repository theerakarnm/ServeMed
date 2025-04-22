import { Card, CardContent } from "@workspace/ui/components/card"

interface ProductOverviewProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any // Using any for now, would be properly typed in a real app
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Detailed Description */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Product Description</h3>
          <div className="prose max-w-none">
            {product.detailedDescription ? (
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              <div dangerouslySetInnerHTML={{ __html: product.detailedDescription }} />
            ) : (
              <p>
                {product.baseDescription ||
                  "This premium health supplement is designed to support your overall wellness. Made with high-quality ingredients and manufactured to the highest standards."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Use */}
      {product.suggestedUse && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Suggested Use</h3>
            <div className="prose max-w-none">
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
              <div dangerouslySetInnerHTML={{ __html: product.suggestedUse }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {product.warnings && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Warnings</h3>
            <div className="prose max-w-none">
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
              <div dangerouslySetInnerHTML={{ __html: product.warnings }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      {product.disclaimer && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <div className="prose max-w-none">
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
              <div dangerouslySetInnerHTML={{ __html: product.disclaimer }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* If no additional content is available */}
      {!product.suggestedUse && !product.warnings && !product.disclaimer && !product.detailedDescription && (
        <div className="text-muted-foreground text-center py-8">
          Additional product information coming soon.
        </div>
      )}
    </div>
  )
}
