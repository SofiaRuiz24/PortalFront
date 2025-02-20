import React, { use, useRef } from "react";
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
import { ArrowDownWideNarrow, Trash2 } from "lucide-react";
import Empresa from "@/app/types/empresasTypes";
import { useToast } from "@/hooks/use-toast"


export function CategoryAll(props: any) {
    const {empresas , setEmpresas, banderaMenu, setBanderaMenu } = useSidebarContext();
    const [ empresaDeCategoria, setempresaDeCatgoria ] = useState<string>("");
    const [ categoriaDeSubcategoria, setCategoriaDeSubcategoria ] = useState<string>("");
    const [ categoriasGenerales , setCategoriasGenerales] = useState<Category[]>([]);
    const [ nuevaEmpresa, setNuevaEmpresa] = useState<string>("");
    const [ nuevaCategoria, setNuevaCategoria] = useState<string>("");
    const [ nuevaSubcategoria, setNuevaSubcategoria] = useState<string>("");
    const [ subcategoriasGenerales, setSubcategoriasGenerales] = useState<SubCategory[]>([]);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const formRef = useRef<HTMLFormElement>(null); // REF para limpiar el formulario
    const formRefCategoria = useRef<HTMLFormElement>(null); // REF para limpiar el formulario de categoría
    const formRefSubcategoria = useRef<HTMLFormElement>(null); // REF para limpiar el formulario de subcategoría
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();
    

    const handleEmpresaSeleccionada = (empresa: string) => {
        setempresaDeCatgoria(empresa);
    };
    const handleCategoriaSeleccionada = (categoria: string) => {
        setCategoriaDeSubcategoria(categoria);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catGeneralResponse, categoriasResponse] = await Promise.all([
                    axios.get("http://localhost:4108/catGeneral"),
                    axios.get("http://localhost:4108/categorias")
                ]);

                setCategoriasGenerales(catGeneralResponse.data.data);
                //console.log("Categorias Generales: ", catGeneralResponse.data);

                const subcategorias = categoriasResponse.data.data.map((subcategoria: any) => ({
                    ...subcategoria,
                    categoria: subcategoria.catGeneral
                }));
                setSubcategoriasGenerales(subcategorias);
                //console.log("SubcategoriasGenerales: ", categoriasResponse.data);
            } catch (error) {
                console.error("Error al obtener las categorías o subcategorías:", error);
            }
        };

        fetchData();
    }, []);

    const handleAgregarEmpresa = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const newEmpresa = nuevaEmpresa;
        if (!newEmpresa) {
            alert("El nombre de la empresa no puede estar vacío.");
            return;
        }
        const response = await axios.post("http://localhost:4108/empresas",{  nombre: newEmpresa } );
        if (response.status >= 200 && response.status < 300) { 
           
            toast({
                title: "Éxito",
                description: "Producto guardado correctamente",
                variant: "default",
                duration: 5000,
            });

            setIsSuccess(true);
        
            setTimeout(() => {
                formRef.current?.reset();
                setIsSuccess(false);
            }, 500);

            setEmpresas([...(empresas || []), response.data.data]);
        }else {
            throw new Error("Respuesta inesperada del servidor");
        }

    };

    const handleAgregarCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nuevaCategoria || !empresaDeCategoria) {
            alert("Debes seleccionar una empresa y escribir un nombre de categoría.");
            return;
        }
       
        try {
            const response = await axios.post("http://localhost:4108/catGeneral", {
                nombre: nuevaCategoria,
                empresa: empresaDeCategoria
            });
    
            if (response.status >= 200 && response.status < 300) { 
                toast({
                    title: "Éxito",
                    description: "Producto guardado correctamente",
                    variant: "default",
                    duration: 5000,
                });
    
                setIsSuccess(true);
                setNuevaCategoria(""); // Limpiar input después de agregar
                setempresaDeCatgoria(""); // Limpiar input después de agregar
                setTimeout(() => {
                    formRefCategoria.current?.reset();
                    setIsSuccess(false);
                }, 500);
                setBanderaMenu("Cambio");

            } else {
                throw new Error("Respuesta inesperada del servidor");
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
            if (response.status >= 200 && response.status < 300) { 
                toast({
                    title: "Éxito",
                    description: "Producto guardado correctamente",
                    variant: "default",
                    duration: 5000,
                });
    
                setIsSuccess(true);
                setNuevaSubcategoria(""); // Limpiar input después de agregar
                setTimeout(() => {
                    formRefSubcategoria.current?.reset();
                    setIsSuccess(false);
                }, 500);
            }else {
                throw new Error("Respuesta inesperada del servidor");
            }
        } catch (error) {
            console.error("Error al agregar la subcategoría:", error);
            alert("Hubo un error al agregar la subcategoría.");
        }
    };

    const handleEliminarEmpresa = async (empresa: Empresa) => {
        const response = await axios.delete(`http://localhost:4108/empresas/${empresa._id}`);
        console.log("Empresa eliminada: ", response.data);
        if (response.status >= 200 && response.status < 300) {
            setEmpresas((prevEmpresas) => (prevEmpresas ? prevEmpresas.filter(e => e._id !== empresa._id) : []));
            console.log("Empresa eliminada: ", response.data);
        }
    }
    const handleEliminarCategoria = async (categoria: Category) => {
        try {
            const response = await axios.delete(`http://localhost:4108/catGeneral/${categoria._id}`);
            console.log("Categoría eliminada: ", response.data);
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            alert(`Error eliminando la categoría: ${error}`);
        }
    }
    const handleEliminarSubcategoria = async (subcategoria: SubCategory) => {
        try {
            const response = await axios.delete(`http://localhost:4108/categorias/${subcategoria._id}`);
            console.log("Subcategoría eliminada: ", response.data);
        } catch (error) {
            console.error("Error al eliminar la subcategoría:", error);
            alert(`Error eliminando la subcategoría: ${error}`);
        };
    }

    return(
        <div className="flex flex-col gap-8 m-2">
            <Card >
                 <CardHeader>
                     <CardTitle className="text-2xl">Agregar Nueva Empresa</CardTitle>
                 </CardHeader>
                    <CardContent>
                    <form
                        ref={formRef}
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
                    <form
                    ref={formRefCategoria} 
                    onSubmit={handleAgregarCategoria}
                    >
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
                <form onSubmit={handleAgregarSubcategoria}
                ref={formRef}>
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
                                                <TableHead className="w-[25%] font-semibold border-r-2">Empresa</TableHead>
                                                <TableHead className="w-[20%] font-semibold border-r-2">Categoría</TableHead>
                                                <TableHead className="w-[20%] font-semibold border-r-2">Subcategoria</TableHead>
                                                <TableHead className="w-[8%] font-semibold text-center">Eliminar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {empresas?.map((empresa) => {
                                            const filteredCategories = categoriasGenerales?.filter((categoria) => categoria.empresa === empresa.nombre);
                                            const isExpanded = expandedRows[empresa.nombre] || false;
                                            
                                            return (
                                            <React.Fragment key={empresa._id}>
                                                <TableRow onClick={() => setExpandedRows((prev) => ({ ...prev, [empresa.nombre]: !prev[empresa.nombre] }))}>
                                                <TableCell className="border-r-2 ">
                                                    <div className="flex items-center gap-6">
                                                    <ArrowDownWideNarrow className="w-[15px] h-[15px] "/>
                                                    {empresa.nombre}
                                                    </div>                                                    
                                                </TableCell>
                                                <TableCell className=" border-r-2 "></TableCell>
                                                <TableCell className="border-r-2 "></TableCell>
                                                <TableCell className="flex justify-center"> 
                                                        <Button 
                                                            className="w-[25px] h-[25px]"
                                                            variant="destructive"
                                                            
                                                            onClick={  () => handleEliminarEmpresa(empresa)}>
                                                            <Trash2 />
                                                        </Button>
                                                </TableCell>
                                                </TableRow>
                                                {isExpanded && filteredCategories?.map((categoria) => {
                                                const filteredSubcategories = subcategoriasGenerales?.filter((subcategoria) => subcategoria?.categoria === categoria?.nombre) || [];
                                                return (
                                                    <React.Fragment key={categoria._id}>
                                                    <TableRow>
                                                        <TableCell className="border-r-2 "></TableCell>
                                                        <TableCell className="border-r-2 ">{categoria.nombre}</TableCell>
                                                        <TableCell className="border-r-2 "></TableCell>
                                                        <TableCell className="flex justify-center">
                                                        <Button 
                                                            className="w-[25px] h-[25px]"
                                                            variant="destructive"
                                                            onClick={() => handleEliminarCategoria(categoria)}>
                                                            <Trash2 />
                                                        </Button>
                                                </TableCell>
                                                    </TableRow>
                                                    {filteredSubcategories.map((subcategoria) => (
                                                        <TableRow key={subcategoria._id}>
                                                        <TableCell className="border-r-2"></TableCell>
                                                        <TableCell className="border-r-2"></TableCell>
                                                        <TableCell className="border-r-2">{subcategoria.nombre}</TableCell>
                                                        <TableCell className="flex justify-center">
                                                        <Button 
                                                            className="w-[25px] h-[25px]"
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