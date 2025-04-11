import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from 'sonner'
import { Link } from "@remix-run/react"

interface ProductVariant {
  variantId: number
  productId: number
  packageDescription: string
  iHerbStockNumber: string | null
  upc: string | null
  price: number
  currency: string
  listPrice: number | null
  servingSize: string | null
  servingsPerContainer: number | null
  bestByDate: Date | null
  isInStock: boolean
  shippingWeightKg: number | null
  dimensionsCm: string | null
}

export function VariantsTable({ data, productId }: { data: ProductVariant[]; productId: number }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<ProductVariant>[] = [
    {
      accessorKey: "variantId",
      header: "ID",
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("variantId")}</div>,
    },
    {
      accessorKey: "packageDescription",
      header: "Package",
      cell: ({ row }) => <div className="font-medium">{row.getValue("packageDescription")}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        const currency = row.getValue("currency") as string
        const listPrice = row.original.listPrice ? Number.parseFloat(row.original.listPrice.toString()) : null

        return (
          <div className="font-medium">
            {currency} {price.toFixed(2)}
            {listPrice && listPrice > price && (
              <div className="text-sm text-muted-foreground line-through">
                {currency} {listPrice.toFixed(2)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "iHerbStockNumber",
      header: "Stock Number",
      cell: ({ row }) => {
        const stockNumber = row.getValue("iHerbStockNumber") as string | null
        return <div>{stockNumber || "—"}</div>
      },
    },
    {
      accessorKey: "isInStock",
      header: "Stock Status",
      cell: ({ row }) => {
        const isInStock = row.getValue("isInStock") as boolean
        return isInStock ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Out of Stock
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const variant = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/products/variants/${productId}/${variant.variantId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/products/variants/${productId}/${variant.variantId}/supplement-facts`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Supplement Facts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  toast('Not implemented')
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter variants..."
          value={(table.getColumn("packageDescription")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("packageDescription")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No variants found. Add your first variant.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
