"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
interface DataTableProps<TData, TValue> {
    data: TData[]
    columns: ColumnDef<TData, TValue>[]
  
  renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement
  getRowCanExpand: (row: Row<TData>) => boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })
  //console.log("Table", data)
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-accent/0" key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
              return (
                <TableHead
                key={header.id}
                className=" text-center font-bold text-black"
                >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow
                className="" 
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                  key={cell.id}
                  
                  >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                </TableRow>
              ))
              ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay unidades.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
