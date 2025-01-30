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
export function Details(props: any) {  
    const { arrayDeProductos, selectedItem } = useSidebarContext(); ;
    const [selectedData, setSelectedData] = useState<Unidades[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    

    useEffect(() => {
        const fetchProduct = async () => {
            if(selectedItem){
                const res = await axios.get(`http://localhost:4108/productos/${selectedItem}`);
                //TO DO: Guardar la respuesta en un estado
                console.log("Response", res.data.updatedProduct);
                setProduct(res.data.updatedProduct);
                
            }
        };
        fetchProduct();
        
    }, [])

    useEffect(() => {
        setSelectedData(product?.unidades || []);
        const data = madeData(selectedData);
        
    }, [product])


    return(
        <div className="flex flex-col justify-center items-center gap-10">
            <div id="DetailHeader" className="flex lg:flex-row justify-center gap-10 w-full">
                <div className="w-1/2 lg:w-1/2 h-[400px] lg:h-auto flex justify-center items-center">
                    <Carousel className="w-2/3 max-w-[600px]">
                        <CarouselContent>
                            {product?.imagen? product.imagen.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex justify-center item-center h-[400px] w-full rounded-lg overflow-hidden">
                                        <img 
                                            src={img.url} 
                                            alt={`Imagen ${index + 1}, nombre: ${img.nombre}`} 
                                            onError={(e) => {
                                                console.error(`Error al cargar imagen: ${img}`);
                                            }}
                                        />
                                    </div>
                                </CarouselItem>
                            )) : <div className="h-[400px] w-[450px] bg-gray-300/70 rounded-xl flex justify-center items-center ">🔄</div>}
                        </CarouselContent>
                        <CarouselPrevious  className="bg-muted/50"/>
                        <CarouselNext className="bg-muted/50"/>
                    </Carousel>
                </div>
                
                <div id="DetailTitle" className="w-full lg:w-1/3 text-center lg:text-left flex flex-col gap-4 h-auto lg:h-[400px]">
                    <h2 className="text-2xl font-bold " >{product?.nombre}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt--2 ">
                    {product?.etiquetas?.map((etiqueta: string) => (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-small px-2 py-0.5 rounded-full ">{etiqueta}</span>))
                    }
                    </div>
                    <p className="text-gray-500">{product?.descripcion}</p>
                </div>
            </div>
            <div id="DetailInfo" className=" lg:w-2/3 w-vw mt-4">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Materiales y su composicion</AccordionTrigger>
                        <AccordionContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor voluptas temporibus harum non ut animi consequatur, tempore obcaecati nam libero, error tenetur? Animi nam voluptatibus ipsa id quibusdam tempora pariatur.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Dimensiones</AccordionTrigger>
                        <AccordionContent>
                        Dolor voluptas temporibus harum non ut animi consequatur. Animi nam voluptatibus ipsa id quibusdam tempora pariatur.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Método de implementacion</AccordionTrigger>
                        <AccordionContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor voluptas temporibus harum non ut animi consequatur, tempore obcaecati nam libero, error tenetur? Animi nam voluptatibus ipsa id quibusdam tempora pariatur.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Stock y disponibilidad</AccordionTrigger>
                        <AccordionContent>
                            Contamos con un stock permanente de 1000 unidades, con disponibilidad inmediata.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Ventajas</AccordionTrigger>
                        <AccordionContent>
                            Contamos con un stock permanente de 1000 unidades, con disponibilidad inmediata.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Accesorios y variantes</AccordionTrigger>
                        <AccordionContent>
                            Contamos con un stock permanente de 1000 unidades, con disponibilidad inmediata.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div id="DateilTable" className="w-full lg:w-4/5 mt-4 mb-8">
                <DataTable columns={columns} data={selectedData} getRowCanExpand={() => true}
      renderSubComponent={renderSubComponent}/>
            </div>
        </div>
    ) 
}