"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useEffect, useState } from 'react';
import Product from "../../app/types/productType"; 
import { Unidades, columns } from "./columns"
import { DataTable } from "./dataTable" 
import { Row } from "@tanstack/react-table"
import axios from "axios";
import { useSidebarContext } from "@/app/context/SidebarContext";
import { Card } from "../ui/card";
import { ArrowDownToLine } from "lucide-react";

const renderSubComponent = ({ row }: { row: Row<Unidades> }) => {
    return (
      <pre style={{ fontSize: '10px' }}>
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    )
}

async function madeData(data: Unidades[]) {
    
    const datas = data.map((unidad) => ({
        nSerie: unidad.nSerie,
        antiguedad: unidad.antiguedad,
        documentos: unidad.documentos,
    }))
    
    return datas;
}
export function Details() {  
    const { arrayDeProductos, selectedItem } = useSidebarContext();
    const [selectedData, setSelectedData] = useState<Unidades[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    
    useEffect(() => {
        const fetchProduct = async () => {
            if(selectedItem){
                const res = await axios.get(`https://t72m2pk3-4108.brs.devtunnels.ms/productos/${selectedItem}`);
                //TO DO: Guardar la respuesta en un estado
                //console.log("Response", res.data.updatedProduct);
                setProduct(res.data.updatedProduct);
            }
        };
        fetchProduct();
    }, [selectedItem])

    useEffect(() => {
        setSelectedData(product?.unidades || []);
        const data = madeData(selectedData);
    }, [product, selectedData])

    return(
        <>
        <Card className="flex flex-col items-center m-2 sm:m-4 pt-4 lg:m-8 lg:pt-8">
            <div id="DetailHeader" className="flex flex-col lg:flex-row w-full lg:h-[600px]">
                <div className="w-full lg:w-1/2 h-[250px] sm:h-[300px] lg:h-auto flex justify-center items-center lg:pb-[120px]">
                    <Carousel className="w-full max-w-[400px] px-2 sm:px-4 lg:w-2/3">
                        <CarouselContent>
                            {product?.imagen[0] ? product.imagen.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex justify-center items-center h-[200px] sm:h-[250px] lg:h-[300px] w-full rounded-lg">
                                        <img 
                                            src={img.url ? img.url : "/images/placeholder.jpeg"} 
                                            alt={`Imagen ${index + 1}, nombre: ${img.nombre}`} 
                                            onError={(e) => {
                                                console.error(`Error al cargar imagen: ${img}`);
                                            }}
                                            className="h-full w-full object-contain rounded-lg border border-black/10 shadow-lg"
                                        />
                                    </div>
                                </CarouselItem>
                            )) : (
                                <CarouselItem>
                                    <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full rounded-lg flex overflow-hidden bg-white justify-center items-center">
                                        <img src="/images/placeholder.png" alt="placeholderImg" className="h-full w-full object-contain rounded-lg border border-black/10 shadow-lg" />
                                    </div>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        <CarouselPrevious className="bg-muted/50 hidden sm:flex"/>
                        <CarouselNext className="bg-muted/50 hidden sm:flex"/>
                    </Carousel>
                </div>
                
                <div id="DetailTitle" className="w-full lg:w-1/2 p-2 sm:p-4 lg:p-6 text-center lg:text-left flex flex-col gap-4">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{product?.nombre}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                        {product?.etiquetas?.map((etiqueta: string, index: number) => (
                            <span key={index} className="inline-block bg-gray-200 text-gray-700 text-xs font-small px-2 py-0.5 rounded-full">
                                {etiqueta}
                            </span>
                        ))}
                    </div>
                    <div className="text-gray-600 bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-inner relative overflow-hidden hover:overflow-y-auto transition-all duration-300 h-[150px] sm:h-[200px] lg:h-[300px] scrollbar-hide">
                        <p className="prose prose-sm text-sm sm:text-base">{product?.descripcion}</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full z-10">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Mas detalles</AccordionTrigger>
                            <AccordionContent>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor voluptas temporibus harum non ut animi consequatur.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </Card>
        <Card className="flex flex-col justify-center items-center gap-4 sm:gap-10 m-2 sm:m-4 lg:m-8 p-2 sm:p-4 lg:pt-8">
            <div id="DateilTable" className="w-full lg:w-4/5 mt-2 sm:mt-4 lg:mt-10 mb-2 sm:mb-4 lg:mb-8">
                {/* Vista móvil*/}
                <div className="block sm:hidden">
                    {selectedData.map((item, index) => (
                        <div key={index} className="mb-4 p-3 bg-white rounded-lg shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">N° Serie: {item.nSerie}</span>
                                <span className="text-sm text-gray-600">Año: {item.antiguedad}</span>
                            </div>
                            <div className="flex gap-2">
                                {item.documentos?.map((doc, docIndex) => (
                                    <button
                                        key={docIndex}
                                        onClick={() => {
                                            const url = URL.createObjectURL(new Blob([doc.pdf]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = doc.nombre;
                                            link.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                                    >
                                        <ArrowDownToLine size={16} />
                                        <span>{doc.nombre.split('.')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Vista para pantallas más grandes */}
                <div className="hidden sm:block">
                    <DataTable 
                        columns={columns} 
                        data={selectedData} 
                        getRowCanExpand={() => true}
                        renderSubComponent={renderSubComponent}
                    />
                </div>
            </div>
        </Card>
        </>
    ) 
}