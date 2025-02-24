import Empresa from "./empresasTypes";
import SubCategory from "./subCategoryType";

//Interface de categoria
interface Category{
    nombre: string;
    _id: string;
    subcategorias: Array<SubCategory>;
    empresa: Empresa;
    icon?: string;
}

export default Category;