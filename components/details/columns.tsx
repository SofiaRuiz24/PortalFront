"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Unidades = {
  numeroSerie: string
  año: number
  status: "disponible" | "reservado" | "vendido"
  documentos: Array<{ nombre: string; pdf: Buffer }>
}

export const columns: ColumnDef<Unidades>[] = [
    {
    accessorKey: "numeroSerie",
    header: "Numero de serie",
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
      const documentos = row.original.documentos;
      return (
        <div className="flex gap-2 ">
          {documentos.map((doc, index) => (
            <button
              key={index}
              onClick={() => {
                const url = URL.createObjectURL(new Blob([doc.pdf]));
                const link = document.createElement('a');
                link.href = url;
                link.download = doc.nombre;
                link.click();
                URL.revokeObjectURL(url);
                }}
                className="flex flex-col w-[100px]  items-center gap-2"
              >
              <span>📄</span>
              <span>{doc.nombre}</span> 
            </button>
          ))}
        </div>
      );
    },
},
]
