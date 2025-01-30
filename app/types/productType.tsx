//Interfaz de Producto
interface Product {
    id: string;
    nombre: string;
    etiquetas: string[];
    descripcion: string;
    imagen: {url:string, nombre:string}[];
    unidades: { nSerie: string, antiguedad: number, documentos: { pdf: string, nombre: string }[] }[];
}
export default Product;