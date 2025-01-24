import { Carousel } from "../ui/carousel"

export function Details(props: any, deprecatedLegacyContext?: any) {  
    const producto = {
        nombre: "Producto",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros",
        etiquetas: ["Servicio de rotacion", "Servicio de recoleccion", "Servicio de rascado"],
    }
    return(
        <div>
            <div id="DetailHeader">
                <Carousel/>
                <div id="DetailTitle">
                    <h2>{producto.nombre}</h2>
                    {producto.etiquetas.map((etiqueta: string) => (
                        <span >{etiqueta}</span>))
                    }
                    <p>{producto.descripcion}</p>
                </div>
            </div>
            <div id="DetailInfo"></div>
            <div id="DateilTable"></div>
        </div>
    ) 
}