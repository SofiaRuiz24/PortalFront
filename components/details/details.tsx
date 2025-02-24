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
import Product from "../../app/types/productType"; // Adjust the import path as necessary
import { Unidades, columns } from "./columns"
import { DataTable } from "./dataTable" 
import { Row } from "@tanstack/react-table"
import axios from "axios";
import { useSidebarContext } from "@/app/context/SidebarContext";
import { Card } from "../ui/card";

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
                const res = await axios.get(`http://localhost:4108/productos/${selectedItem}`);
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
        <Card className="flex flex-col items-center m-8 pt-8 lg:h-[600px]">
            <div id="DetailHeader" className="flex lg:flex-row w-full lg:h-[600px] ">
                <div className="w-1/2 lg:w-1/2 h-[400px] lg:h-auto flex justify-center items-center pb-[120px]">
                    <Carousel className="w-2/3 max-w-[400px] ">
                        <CarouselContent className="">
                            {product?.imagen[0]? product.imagen.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex justify-center item-center h-[300px] w-full rounded-lg border-black shadow-lg">
                                        <img 
                                            src={img.url? img.url : "/images/placeholder.jpeg"} 
                                            alt={`Imagen ${index + 1}, nombre: ${img.nombre}`} 
                                            onError={(e) => {
                                                console.error(`Error al cargar imagen: ${img}`);
                                            }}
                                            className="border-black shadow-lg"
                                        />
                                    </div>
                                </CarouselItem>
                            )) : <CarouselItem >
                                <div className="h-[400px] w-full rounded-lg flex overflow-hidden bg-white justify-center items-center border-black shadow-lg">
                                    <img src="/images/placeholder.png" alt="placeholderImg" className="border-black shadow-lg" />
                                </div>
                                </CarouselItem>}
                        </CarouselContent>
                        <CarouselPrevious  className="bg-muted/50"/>
                        <CarouselNext className="bg-muted/50"/>
                    </Carousel>
                </div>
                
                <div id="DetailTitle" className="lg:w-1/2 p-2  text-center lg:text-left flex flex-col gap-4 lg:h-auto">
                    <h2 className="text-2xl font-bold " >{product?.nombre}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt--2 ">
                    {product?.etiquetas?.map((etiqueta: string) => (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-small px-2 py-0.5 rounded-full ">{etiqueta}</span>))
                    }
                    </div>
                    <div className="text-gray-600 bg-gray-200 backdrop-blur-sm rounded-lg h-[300px] p-4 mr-2  shadow-inner relative overflow-hidden hover:overflow-y-auto transition-all duration-300 scrollbar-hide">
                        <p className="prose prose-sm">{product?.descripcion}</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full z-10 ">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Mas detalles</AccordionTrigger>
                            <AccordionContent>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor voluptas temporibus harum non ut animi consequatur, tempore obcaecati nam libero, error tenetur? Animi nam voluptatibus ipsa id quibusdam tempora pariatur.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            {/*<div id="DetailInfo" className=" lg:w-2/3 w-vw mt-4">
                
            </div>*/}
             </Card>
            <Card className="flex flex-col justify-center items-center gap-20 m-8 pt-8">
            <div id="DateilTable" className=" lg:w-4/5 mt-10 mb-8">
                <DataTable columns={columns} data={selectedData} getRowCanExpand={() => true}
                    renderSubComponent={renderSubComponent}/>
            </div>
        </Card>
        </>
    ) 
}