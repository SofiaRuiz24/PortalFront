//Interface de categoria
interface Category{
    nombre: string;
    _id: string;
    subcategorias: Array<string>;
    empresa: string;
}

export default Category;