"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Unidades = {
  patente: string
  año: number
  status: "disponible" | "reservado" | "vendido"
  documentos: Array<{ nombre: string; pdf: Buffer }>
}

export const columns: ColumnDef<Unidades>[] = [
    {
    accessorKey: "patente",
    header: "Patente",
    },
    {
    accessorKey: "año",
    header: "Año",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
    accessorKey: "documentos",
    header: "Documentos",
    cell: ({ row }) => {
        return row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '👇' : '👉'}
          </button>
        ) : (
          '🔵'
        )
    },
},
]
