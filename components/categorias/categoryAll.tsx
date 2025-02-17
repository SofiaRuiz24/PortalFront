import React, { use } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    Row,
    useReactTable,
  } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/app/context/SidebarContext";
import { useState , useEffect } from "react";
import axios from "axios";
import Category from "@/app/types/categoryType";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import SubCategory from "@/app/types/subCategoryType";
import { Trash2 } from "lucide-react";
import Empresa from "@/app/types/empresasTypes";


export function CategoryAll(props: any) {
    const {empresas} = useSidebarContext();
    const [ empresaDeCategoria, setempresaDeCatgoria ] = useState<string>("");
    const [ categoriaDeSubcategoria, setCategoriaDeSubcategoria ] = useState<string>("");
    const [ categoriasGenerales , setCategoriasGenerales] = useState<Category[]>([]);
    const [ nuevaEmpresa, setNuevaEmpresa] = useState<string>("");
    const [ nuevaCategoria, setNuevaCategoria] = useState<string>("");
    const [ nuevaSubcategoria, setNuevaSubcategoria] = useState<string>("");
    const [ subcategoriasGenerales, setSubcategoriasGenerales] = useState<SubCategory[]>([]);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
   



    const handleEmpresaSeleccionada = (empresa: string) => {
        setempresaDeCatgoria(empresa);
    };
    const handleCategoriaSeleccionada = (categoria: string) => {
        setCategoriaDeSubcategoria(categoria);
    };
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:4108/catGeneral");
            setCategoriasGenerales(response.data.data);
            console.log("Categorias Generales: ",response.data);
        };
        const fetchCategorias = async () => {
            const response = await axios.get("http://localhost:4108/categorias");
            const subcategorias = response.data.data.map((subcategoria: any) => ({
                ...subcategoria,
                categoria: subcategoria.catGeneral
            }));
            setSubcategoriasGenerales(subcategorias);
            console.log("SubcategoriasGenerales: ",response.data);
        };
        fetchCategorias();
        fetchData();
       
        
    },[]);

    const handleAgregarEmpresa = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const newEmpresa = nuevaEmpresa;
        if (!newEmpresa) {
            alert("El nombre de la empresa no puede estar vacío.");
            return;
        }
        const response = await axios.post("http://localhost:4108/empresas",{  nombre: newEmpresa } );
    };

    const handleAgregarCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nuevaCategoria || !empresaDeCategoria) {
            alert("Debes seleccionar una empresa y escribir un nombre de categoría.");
            return;
        }
        //console.log("Empresa de categoria: ", empresaDeCategoria);
        //console.log("Nueva categoria: ", nuevaCategoria);
        
        try {
            const response = await axios.post("http://localhost:4108/catGeneral", {
                nombre: nuevaCategoria,
                empresa: empresaDeCategoria
            });
    
            if (response.status === 200) {
                alert("Categoría agregada con éxito.");
                setNuevaCategoria(""); // Limpiar input después de agregar
            }
        } catch (error) {
            console.error("Error al agregar la categoría:", error);
            alert("Hubo un error al agregar la categoría.");
        }
    };
    const handleAgregarSubcategoria = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        if (!nuevaSubcategoria || !categoriaDeSubcategoria) {
            alert("Debes seleccionar una categoría y escribir un nombre de subcategoría.");
            return;
        }
        console.log("Categoria de subcategoria: ", categoriaDeSubcategoria);
        console.log("Nueva subcategoria: ", nuevaSubcategoria);

        try {
            const response = await axios.post("http://localhost:4108/categorias", {
                nombre: nuevaSubcategoria,
                categoriaGeneral: categoriaDeSubcategoria
            });
            if (response.status === 200) {
                alert("Subcategoría agregada con éxito.");
                setNuevaSubcategoria(""); // Limpiar input después de agregar
            }
        } catch (error) {
            console.error("Error al agregar la subcategoría:", error);
            alert("Hubo un error al agregar la subcategoría.");
        }
    };

    const handleEliminarEmpresa = async (empresa: Empresa) => {
        const response = await axios.delete(`http://localhost:4108/empresas/${empresa._id}`);
        console.log("Empresa eliminada: ", response.data);
    }
    const handleEliminarCategoria = async (categoria: Category) => {
        const response = await axios.delete(`http://localhost:4108/catGeneral/${categoria._id}`);
        
    }
    const handleEliminarSubcategoria = async (subcategoria: SubCategory) => {
        const response = await axios.delete(`http://localhost:4108/categorias/${subcategoria._id}`);
    }

    return(
        <div className="flex flex-col gap-8 m-2">
            <Card >
                 <CardHeader>
                     <CardTitle className="text-2xl">Agregar Nueva Empresa</CardTitle>
                 </CardHeader>
                    <CardContent>
                    <form
                         action="http://localhost:4108/empresas"
                         method="post"
                         onSubmit={handleAgregarEmpresa}
                         encType="multipart/form-data"
                        >
                        <div className="flex flex-col gap-4 w-1/2">
                            <Label className="text-lg">Nombre de la Empresa</Label>
                            <Input 
                                type="text" 
                                name="nombre" 
                                className="border border-gray-700 p-2" 
                                onChange={(e) => setNuevaEmpresa(e.target.value)}
                            />
                        </div>
                         {/* Botón Submit */}
                         <div className="flex justify-center pt-4">
                            <Button 
                                type="submit"
                            > 
                                Agregar Empresa
                            </Button>
                        </div>
                    </form>
                    </CardContent>
            </Card>
            <Card >
                 <CardHeader>
                     <CardTitle className="text-2xl">Agregar Nueva Categoria</CardTitle>
                 </CardHeader>
                    <CardContent>
                    <form onSubmit={handleAgregarCategoria}>
                    <div className="flex flex-row gap-4 w-full justify-between ">
                         <div className="w-full flex flex-col gap-2">
                            <label className="text-lg">Seleccionar Empresa</label>
                            <Select name="empresas" onValueChange={handleEmpresaSeleccionada}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una empresa." />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {empresas?.map((empresa) => (
                                            <SelectItem key={empresa._id} value={empresa.nombre}>
                                                {empresa.nombre.charAt(0).toUpperCase() + empresa.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-lg">Nombre de la Categoria</label>
                            <input 
                                type="text" 
                                className="border border-gray-700 p-2"
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                />
                        </div>
                        
                    </div>
                    
                         {/* Botón Submit */}
                         <div className="flex justify-center pt-4">
                            <Button 
                                type="submit"
                                > 
                                Agregar Categoria
                            </Button>
                        </div>
                    </form>
                    </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="text-2xl">Agregar Nueva Subcategoria</CardTitle>
                </CardHeader>

                <CardContent>
                <form onSubmit={handleAgregarSubcategoria}>
                  <div className="flex flex-row gap-4 w-full justify-between ">
                  <div className="w-full flex flex-col gap-2">
                            <label className="text-lg">Seleccionar Categoria</label>
                            <Select name="categoria" onValueChange={handleCategoriaSeleccionada}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una categoria." />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {categoriasGenerales?.map((categoria) => (
                                            <SelectItem key={categoria._id} value={categoria.nombre}>
                                                {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                            </Select>
                     </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg">Nombre de la Subcategoria</label>
                        <input 
                            type="text" 
                            value={nuevaSubcategoria}
                            onChange={(e) => setNuevaSubcategoria(e.target.value)}
                            className="border border-gray-700 p-2" />
                     </div>
                   
                    </div>
                        {/* Botón Submit */}
                        <div className="flex justify-center pt-4">
                            <Button 
                                type="submit"
                                > 
                                 Agregar Subcategoria
                            </Button>
                        </div>
                    </form>                             
                </CardContent>                             
            </Card>
            <div >
             <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl mb-4">Lista de Empresas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[25%] font-semibold">Empresa</TableHead>
                                                <TableHead className="w-[20%] font-semibold">Categoría</TableHead>
                                                <TableHead className="w-[20%] font-semibold">Subcategoria</TableHead>
                                                <TableHead className="w-[8%] font-semibold">Eliminar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {/*<TableBody>
                                            {empresas?.map((empresa) => {
                                                const filteredCategories = categoriasGenerales?.filter((categoria) => categoria.empresa === empresa);
                                                const [isExpanded, setIsExpanded] = useState(false);

                                                return (
                                                    <React.Fragment key={empresa}>
                                                        <TableRow onClick={() => setIsExpanded(!isExpanded)}>
                                                            <TableCell className="w-[25%]">{empresa}</TableCell>
                                                            <TableCell className="w-[20%]"></TableCell>
                                                            <TableCell className="w-[20%]"></TableCell>
                                                        </TableRow>
                                                        {isExpanded && filteredCategories.map((categoria) => {
                                                            const filteredSubcategories = subcategoriasGenerales?.filter((subcategoria) => subcategoria.categoria === categoria.nombre);
                                                            return (
                                                                <React.Fragment key={categoria._id}>
                                                                    <TableRow>
                                                                        <TableCell className="w-[25%]"></TableCell>
                                                                        <TableCell className="w-[20%]">{categoria.nombre}</TableCell>
                                                                        <TableCell className="w-[20%]"></TableCell>
                                                                    </TableRow>
                                                                    {filteredSubcategories.map((subcategoria) => (
                                                                        <TableRow key={subcategoria._id}>
                                                                            <TableCell className="w-[25%]"></TableCell>
                                                                            <TableCell className="w-[20%]"></TableCell>
                                                                            <TableCell className="w-[20%]">{subcategoria.nombre}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>*/}
                                        <TableBody>
                                        {empresas?.map((empresa) => {
                                            const filteredCategories = categoriasGenerales?.filter((categoria) => categoria.empresa === empresa.nombre);
                                            const isExpanded = expandedRows[empresa.nombre] || false;

                                            return (
                                            <React.Fragment key={empresa._id}>
                                                <TableRow onClick={() => setExpandedRows((prev) => ({ ...prev, [empresa.nombre]: !prev[empresa.nombre] }))}>
                                                <TableCell className="w-[25%]">{empresa.nombre}</TableCell>
                                                <TableCell className="w-[20%]"></TableCell>
                                                <TableCell className="w-[20%]"></TableCell>
                                                <TableCell>
                                                        <Button 
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleEliminarEmpresa(empresa)}>
                                                            <Trash2 />
                                                        </Button>
                                                </TableCell>
                                                </TableRow>
                                                {isExpanded && filteredCategories.map((categoria) => {
                                                const filteredSubcategories = subcategoriasGenerales?.filter((subcategoria) => subcategoria.categoria === categoria.nombre);
                                                return (
                                                    <React.Fragment key={categoria._id}>
                                                    <TableRow>
                                                        <TableCell className="w-[25%]"></TableCell>
                                                        <TableCell className="w-[20%]">{categoria.nombre}</TableCell>
                                                        <TableCell className="w-[20%]"></TableCell>
                                                        <TableCell>
                                                        <Button 
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleEliminarCategoria(categoria)}>
                                                            <Trash2 />
                                                        </Button>
                                                </TableCell>
                                                    </TableRow>
                                                    {filteredSubcategories.map((subcategoria) => (
                                                        <TableRow key={subcategoria._id}>
                                                        <TableCell className="w-[25%]"></TableCell>
                                                        <TableCell className="w-[20%]"></TableCell>
                                                        <TableCell className="w-[20%]">{subcategoria.nombre}</TableCell>
                                                        <TableCell>
                                                        <Button 
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleEliminarSubcategoria(subcategoria)}>
                                                            <Trash2 />
                                                        </Button>
                                                </TableCell>
                                                        </TableRow>
                                                    ))}
                                                   
                                                    </React.Fragment>
                                                );
                                                })}
                                            </React.Fragment>
                                            );
                                        })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                </Card>
    
        </div>
    </div>
    )
}