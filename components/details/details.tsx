import { Carousel } from "../ui/carousel"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

export function Details(props: any, deprecatedLegacyContext?: any) {  
    const producto = {
        nombre: "Producto",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros",
        etiquetas: ["Servicio de rotacion", "Servicio de recoleccion", "Servicio de rascado"],
    }
    return(
        //quiero usar tailwindcss
        <div className="flex flex-col justify-center items-center gap-10">
            <div id="DetailHeader" className="flex lg:flex-row justify-center gap-10 w-full">
                <div className="w-1/2 lg:w-1/2 h-[400px] lg:h-auto flex justify-center items-center">
                    <div className="h-[400px] w-[450px] bg-gray-300/70 rounded-xl flex justify-center items-center ">🔄</div>
                    <Carousel/>
                </div>
                
                <div id="DetailTitle" className="w-full lg:w-1/3 text-center lg:text-left flex flex-col gap-4 h-auto lg:h-[400px]">
                    <h2 className="text-2xl font-bold " >{producto.nombre}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt--2 ">
                    {producto.etiquetas.map((etiqueta: string) => (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-small px-2 py-0.5 rounded-full ">{etiqueta}</span>))
                    }
                    </div>
                    <p className="text-gray-500">{producto.descripcion}</p>
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
            <div id="DateilTable">
                
            </div>
        </div>
    ) 
}