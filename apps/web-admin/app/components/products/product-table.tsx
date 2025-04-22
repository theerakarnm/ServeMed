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
import { Edit, Link, MoreHorizontal, Star, Trash } from "lucide-react"

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

interface Product {
  productId: number
  name: string
  brandId: number
  brandName: string
  overallRating: number | null
  totalReviews: number
  isuraVerified: boolean
  dateFirstAvailable: Date | string | null
}

export function ProductsTable({ data }: { data: Product[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "productId",
      header: "ID",
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("productId")}</div>,
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "brandName",
      header: "Brand",
      cell: ({ row }) => <div>{row.getValue("brandName")}</div>,
    },
    {
      accessorKey: "overallRating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("overallRating") as number | null
        return (
          <div className="flex items-center">
            {rating ? (
              <>
                <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                <span>{rating.toFixed(1)}</span>
              </>
            ) : (
              <span className="text-muted-foreground">No ratings</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "totalReviews",
      header: "Reviews",
      cell: ({ row }) => <div>{row.getValue("totalReviews")}</div>,
    },
    {
      accessorKey: "isuraVerified",
      header: "Verified",
      cell: ({ row }) => {
        const isVerified = row.getValue("isuraVerified") as boolean
        return isVerified ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Verified
          </Badge>
        ) : null
      },
    },
    {
      accessorKey: "dateFirstAvailable",
      header: "First Available",
      cell: ({ row }) => {
        const date = row.getValue("dateFirstAvailable") as Date | null
        return date ? (
          <div>{new Date(date).toLocaleDateString()}</div>
        ) : (
          <div className="text-muted-foreground">Not set</div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

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
                <Link to={`/products/${product.productId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/products/${product.productId}/variants`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Variants
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/products/${product.productId}/images`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Images
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
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
                  No products found.
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
