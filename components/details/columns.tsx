"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDownToLine, FileDown, FileX } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Unidades = {
  nSerie: string
  antiguedad: number
 // status: "disponible" | "reservado" | "vendido"
  documentos: Array<{ nombre: string; pdf: string }>
}

export const columns: ColumnDef<Unidades>[] = [
    {
    accessorKey: "nSerie",
    header: "Numero de serie",
    cell:
      ({ row }) => {
        return (
         <div className="flex justify-center">
          <span>{row.original.nSerie}</span>
         </div>
        );
      },
    },
    {
    accessorKey: "antiguedad",
    header: "Año",
    cell:
      ({ row }) => {
        return (
         <div className="flex justify-center">
          <span>{row.original.antiguedad}</span>
         </div>
        );
      },
    },
    /*{
      accessorKey: "status",
      header: "Status",
    },
    {
    accessorKey: "documentos",
    header: "Documentos",
    cell: ({ row }) => {
      const documentos = row.original.documentos;
      return (
        <div className="flex gap-2 justify-center ">
          {documentos?.map((doc, index) => (
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
                className="flex flex-col w-[100px] justify-center items-center gap-2"
              >
              <span>📄</span>
              <span className="w-[80px] ">{doc.nombre.split(".pdf")}</span> 
            </button>
          ))}
        </div>
      );
    },
},*/
{
  accessorKey: "patente",
  header: "Patente",
  cell:
    ({ row }) => {
      const documentos = row.original.documentos;
      return (
       <div className="flex justify-center ">
        {documentos?.map((doc, index) => {
          if (doc.nombre.includes("patente")) {
            return (
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
                className="flex flex-col w-1/6 justify-center items-center gap-2"
              >
                <ArrowDownToLine size={24} />
                
              </button>
            );
          } else {
            //return null;
          
            //si no hay documentos de patente que se muestre una solo X
            if (index === documentos.length - 1 && !documentos.some(doc => doc.nombre.includes("patente"))) {
            return (
              <div className="flex flex-col w-1/6 justify-center items-center gap-2">
              <FileX size={24} />
              </div>
            );
            }
          }
        })}
       </div>
      );
    },
  },
  {
    accessorKey: "certificadoA",
    header: "Certificado A",
    cell:
      ({ row }) => {
        const documentos = row.original.documentos;
        return (
         <div className="flex justify-center">
          {documentos?.map((doc, index) => {
            if (doc.nombre.includes("certificadoA")) {
              return (
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
                  className="flex flex-col w-1/6 justify-center items-center gap-2"
                >
                  <ArrowDownToLine size={24} />
                  
                </button>
              );
            } else {
              if (index === documentos.length - 1 && !documentos.some(doc => doc.nombre.includes("certificadoA"))) {
                return (
                  <div className="flex flex-col w-1/6 justify-center items-center gap-2">
                  <FileX size={24} />
                  </div>
                );
                }
            }
          })}
         </div>
        );
      },
    },
    {
      accessorKey: "certificadoB",
      header: "Certificado B",
      cell:
        ({ row }) => {
          const documentos = row.original.documentos;
          return (
           <div className="flex justify-center">
            {documentos?.map((doc, index) => {
              if (doc.nombre.includes("certificadoB")) {
                return (
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
                    className="flex flex-col w-1/6 justify-center items-center gap-2"
                  >
                    <ArrowDownToLine size={24} />
                    
                  </button>
                );
              } else {
                if (index === documentos.length - 1 && !documentos.some(doc => doc.nombre.includes("certificadoB"))) {
                  return (
                    <div className="flex flex-col w-1/6 justify-center items-center gap-2">
                    <FileX size={24} />
                    </div>
                  );
                  }
              }
            })}
           </div>
          );
        },
      },
      {
        accessorKey: "certificadoC",
        header: "Certificado C",
        cell:
          ({ row }) => {
            const documentos = row.original.documentos;
            return (
             <div className="flex justify-center">
              {documentos?.map((doc, index) => {
                if (doc.nombre.includes("certificadoC")) {
                  return (
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
                      className="flex flex-col w-1/6 justify-center items-center gap-2"
                    >
                      <ArrowDownToLine size={24} />
                      
                    </button>
                  );
                } else {
                  if (index === documentos.length - 1 && !documentos.some(doc => doc.nombre.includes("certificadoC"))) {
                    return (
                      <div className="flex flex-col w-1/6 justify-center items-center gap-2">
                      <FileX size={24} />
                      </div>
                    );
                    }
                }
              })}
             </div>
            );
          },
        },
]
