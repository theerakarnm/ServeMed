import { Separator } from "@workspace/ui/components/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Info } from 'lucide-react'

interface ProductIngredientsProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any // Using any for now, would be properly typed in a real app
}

export default function ProductIngredients({ product }: ProductIngredientsProps) {
  // This is a mock function - in a real app, you'd fetch this data
  const getNutritionFacts = () => {
    return [
      { name: "Vitamin C", amount: "500mg", dailyValue: "556%" },
      { name: "Zinc", amount: "15mg", dailyValue: "136%" },
      { name: "Vitamin D3", amount: "50mcg", dailyValue: "250%" },
    ]
  }

  const nutritionFacts = getNutritionFacts()

  return (
    <div className="space-y-8">
      {/* Nutrition Facts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nutrition Facts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Amount Per Serving</TableHead>
              <TableHead>% Daily Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutritionFacts.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.dailyValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-muted-foreground">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </p>
      </div>

      <Separator />

      {/* Other Ingredients */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Other Ingredients</h2>
        {product.otherIngredients ? (
          <div className="prose max-w-none">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: product.otherIngredients }} />
          </div>
        ) : (
          <p>No other ingredients information available.</p>
        )}
      </div>

      <Separator />

      {/* Allergen Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Allergen Information</h2>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Contains no artificial colors, flavors or preservatives. Free from gluten, wheat, dairy, soy, and GMOs.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
