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
import { ArrowDownWideNarrow, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import Empresa from "@/app/types/empresasTypes";
import { useToast } from "@/hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown,
    AudioWaveform,
    BookOpen,
    Bot,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    Shrink,
    Hammer,
    Package,
    RefreshCw,
    Fan,
    Webhook,
    UsersRound,
    PencilRuler,
} from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export function CategoryAll(props: any) {
    const { empresas, setEmpresas, banderaMenu, setBanderaMenu } = useSidebarContext();
    const [empresaDeCategoria, setempresaDeCatgoria] = useState<string>("");
    const [categoriaDeSubcategoria, setCategoriaDeSubcategoria] = useState<string>("");
    const [categoriasGenerales, setCategoriasGenerales] = useState<Category[]>([]);
    const [nuevaEmpresa, setNuevaEmpresa] = useState<string>("");
    const [nuevaCategoria, setNuevaCategoria] = useState<string>("");
    const [nuevaSubcategoria, setNuevaSubcategoria] = useState<string>("");
    const [subcategoriasGenerales, setSubcategoriasGenerales] = useState<SubCategory[]>([]);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const formRef = useRef<HTMLFormElement>(null); // REF para limpiar el formulario
    const formRefCategoria = useRef<HTMLFormElement>(null); // REF para limpiar el formulario de categoría
    const formRefSubcategoria = useRef<HTMLFormElement>(null); // REF para limpiar el formulario de subcategoría
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();
    const [expandedMobileItems, setExpandedMobileItems] = useState<Record<string, boolean>>({});
    const [selectedIcon, setSelectedIcon] = useState<string>("");
    const [selectedIconEmpresa, setSelectedIconEmpresa] = useState<string>("");

    const icons = [
        { value: "webhook", label: "Webhook", icon: Webhook },
        { value: "fan", label: "Fan", icon: Fan },
        { value: "shrink", label: "Shrink", icon: Shrink },
        { value: "hammer", label: "Hammer", icon: Hammer },
        { value: "package", label: "Package", icon: Package },
        { value: "refresh", label: "Refresh", icon: RefreshCw },
        { value: "settings", label: "Settings", icon: Settings2 },
        { value: "audioWaveform", label: "Audio Waveform", icon: AudioWaveform },
        { value: "bookOpen", label: "Book Open", icon: BookOpen },
        { value: "bot", label: "Bot", icon: Bot },
        { value: "frame", label: "Frame", icon: Frame },
        { value: "galleryVerticalEnd", label: "Gallery Vertical End", icon: GalleryVerticalEnd },
        { value: "map", label: "Map", icon: Map },
        { value: "pieChart", label: "Pie Chart", icon: PieChart },
        { value: "usersRound", label: "Users Round", icon: UsersRound },
        { value: "pencilRuler", label: "Pencil Ruler", icon: PencilRuler },
    ];
    const iconEmpresa =[
        {value: "GalleryVerticalEnd" ,label: "Gallery Vertical End", icon: GalleryVerticalEnd},
        {value: "AudioWaveform" ,label: "AudioWaveform", icon: AudioWaveform},
        {value: "BookOpen", label: "Book Open", icon: BookOpen},
    ]

    const handleEmpresaSeleccionada = (empresa: string) => {
        setempresaDeCatgoria(empresa);
    };
    const handleCategoriaSeleccionada = (categoria: string) => {
        setCategoriaDeSubcategoria(categoria);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const catGeneralResponse = await axios.get("http://localhost:4108/catGeneral");
                setCategoriasGenerales(catGeneralResponse.data.data);
                console.log("Categorias Generales: ", catGeneralResponse.data);
                const categoriasResponse = await axios.get("http://localhost:4108/categorias");
                const subcategorias = categoriasResponse.data.data?.map((subcategoria: any) => ({
                    ...subcategoria,
                    categoria: subcategoria.catGeneral
                })) || [];
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
        if (!newEmpresa && !selectedIconEmpresa) {
            alert("El nombre de la empresa no puede estar vacío.");
            return;
        }
        console.log("Entraba a agregar empresa");
        const response = await axios.post("http://localhost:4108/empresas",{  nombre: newEmpresa , icon: selectedIconEmpresa} );
        console.log("Empresa guardada: ", response.data);
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
            setSelectedIconEmpresa(selectedIconEmpresa);
        }else {
            throw new Error("Respuesta inesperada del servidor");
        }

    };

    const handleSeleccionarIcono = (icono: string) => {
        setSelectedIconEmpresa(icono);
        setSelectedIcon(icono);
    };

    const handleAgregarCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nuevaCategoria || !empresaDeCategoria || !selectedIcon) {
            alert("Debes seleccionar una empresa, escribir un nombre de categoría y seleccionar un icono.");
            return;
        }
       
        try {
            const response = await axios.post("http://localhost:4108/catGeneral", {
                nombre: nuevaCategoria,
                empresa: empresaDeCategoria,
                icon: selectedIcon
            });
    
            if (response.status >= 200 && response.status < 300) { 
                toast({
                    title: "Éxito",
                    description: "Categoría guardada correctamente",
                    variant: "default",
                    duration: 5000,
                });
    
                setIsSuccess(true);
                setNuevaCategoria(""); 
                setempresaDeCatgoria(""); 
                setSelectedIcon(""); 
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
                setBanderaMenu("Cambio Subcategoria");
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

    const toggleMobileExpand = (id: string) => {
        setExpandedMobileItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return(
        <div className="flex flex-col gap-4 sm:gap-8 p-2 sm:p-4 lg:p-8">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Agregar Nueva Empresa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        ref={formRef}
                        onSubmit={handleAgregarEmpresa}
                        className="space-y-4"
                    > 
                        <div className="flex gap-4">
                            <div className="flex flex-col w-1/3 space-y-2 ">
                                <Label className=" text-sm font-medium ">Icono de la Empresa</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className=" justify-between bg-white"
                                        >
                                            {selectedIconEmpresa ? (
                                                <div className="flex items-center gap-2">
                                                    {iconEmpresa?.find(iconEmpresa => iconEmpresa.value === selectedIconEmpresa)?.icon && 
                                                        React.createElement(iconEmpresa.find(iconEmpresa => iconEmpresa.value === selectedIconEmpresa)!.icon, { className: "h-4 w-4" })}
                                                    {iconEmpresa?.find(iconEmpresa => iconEmpresa.value === selectedIconEmpresa)?.label}
                                                </div>
                                            ) : (
                                                "Seleccionar icono"
                                            )}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 grid-cols-3 grid">
                                        {iconEmpresa?.map((iconEmpresa) => (
                                            <Button
                                                key={iconEmpresa.value}
                                                variant="ghost"
                                                className="w-full"
                                                onClick={() => {handleSeleccionarIcono(iconEmpresa.value)
                                                    console.log("Icono seleccionado: ", typeof(iconEmpresa.value))
                                                }}
                                            >
                                                <div className="flex items-center gap-2 ">
                                                    {iconEmpresa.icon && React.createElement(iconEmpresa.icon, { className: "h-4 w-4" })}
                                                    
                                                </div>
                                            </Button>
                                        ))}
                            
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2 w-2/3">
                                <Label className="text-sm font-medium">Nombre de la Empresa</Label>
                                <Input 
                                    type="text" 
                                    name="nombre" 
                                    onChange={(e) => setNuevaEmpresa(e.target.value)}
                                    className="w-full"
                                    placeholder="Ingrese el nombre de la empresa"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                                <Button type="submit">
                                    Agregar Empresa
                                </Button>
                            </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Agregar Nueva Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        ref={formRefCategoria} 
                        onSubmit={handleAgregarCategoria}
                        className="space-y-4"
                    >
                        <div className="flex sm:grid-cols-3 gap-4">
                            <div className="w-2/5 space-y-2">
                                <Label className="text-sm font-medium">Seleccionar Empresa</Label>
                                <Select name="empresas" onValueChange={handleEmpresaSeleccionada}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una empresa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {empresas?.map((empresa) => (
                                            <SelectItem key={empresa._id} value={empresa.nombre}>
                                                {empresa.nombre.charAt(0).toUpperCase() + empresa.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-1/5 space-y-2">
                                <Label className=" text-sm font-medium ">Icono de la Categoría</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className=" justify-between bg-white"
                                        >
                                            {selectedIcon ? (
                                                <div className="flex items-center gap-2">
                                                    {icons?.find(icon => icon.value === selectedIcon)?.icon && 
                                                        React.createElement(icons.find(icon => icon.value === selectedIcon)!.icon, { className: "h-4 w-4" })}
                                                    {icons?.find(icon => icon.value === selectedIcon)?.label}
                                                </div>
                                            ) : (
                                                "Seleccionar icono"
                                            )}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 grid-cols-4 grid">
                                        {icons?.map((icon) => (
                                            <Button
                                                key={icon.value}
                                                variant="ghost"
                                                className="w-full"
                                                onClick={() => {setSelectedIcon(icon.value)
                                                    console.log("Icono seleccionado: ", typeof(icon.value))
                                                }}
                                            >
                                                <div className="flex items-center gap-2 ">
                                                    {icon.icon && React.createElement(icon.icon, { className: "h-4 w-4" })}
                                                    
                                                </div>
                                            </Button>
                                        ))}
                            
                                    </PopoverContent>
                                </Popover>
                            </div>
                        
                            <div className="space-y-2 w-2/5">
                                <Label className="text-sm font-medium">Nombre de la Categoría</Label>
                                <Input 
                                    type="text" 
                                    value={nuevaCategoria}
                                    onChange={(e) => setNuevaCategoria(e.target.value)}
                                    placeholder="Ingrese el nombre de la categoría"
                                />
                            </div>
                            </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                Agregar Categoría

                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Agregar Nueva Subcategoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <form 
                        onSubmit={handleAgregarSubcategoria}
                        ref={formRefSubcategoria}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Seleccionar Categoría</Label>
                                <Select name="categoria" onValueChange={handleCategoriaSeleccionada}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriasGenerales?.map((categoria) => (
                                            <SelectItem key={categoria._id} value={categoria.nombre}>
                                                {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Nombre de la Subcategoría</Label>
                                <Input 
                                    type="text" 
                                    value={nuevaSubcategoria}
                                    onChange={(e) => setNuevaSubcategoria(e.target.value)}
                                    placeholder="Ingrese el nombre de la subcategoría"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                Agregar Subcategoría
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Lista de Empresas</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Vista móvil*/}
                    <div className="block sm:hidden space-y-4">
                        {empresas?.map((empresa) => {
                            const filteredCategories = categoriasGenerales?.filter(
                                (categoria) => categoria.empresa.nombre === empresa.nombre
                            );
                            const isExpanded = expandedMobileItems[empresa._id] || false;

                            return (
                                <div key={empresa._id} className="bg-secondary/10 rounded-lg">
                                    <div 
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => toggleMobileExpand(empresa._id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <span className="font-semibold">{empresa.nombre}</span>
                                        </div>
                                        <Button 
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarEmpresa(empresa);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="px-4 pb-4">
                                            {filteredCategories?.map((categoria) => {
                                                const filteredSubcategories = subcategoriasGenerales?.filter(
                                                    (subcategoria) => subcategoria?.categoria === categoria?.nombre
                                                );
                                                const isCategoryExpanded = expandedMobileItems[categoria._id] || false;

                                                return (
                                                    <div key={categoria._id} className="ml-4 mb-2">
                                                        <div 
                                                            className="flex items-center justify-between py-2 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleMobileExpand(categoria._id);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {isCategoryExpanded ? (
                                                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                                )}
                                                                <span className="font-medium">{categoria.nombre}</span>
                                                            </div>
                                                            <Button 
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEliminarCategoria(categoria);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        {isCategoryExpanded && filteredSubcategories?.map((subcategoria) => (
                                                            <div key={subcategoria._id} className="ml-8 flex items-center justify-between py-2">
                                                                <span className="text-sm">{subcategoria.nombre}</span>
                                                                <Button 
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEliminarSubcategoria(subcategoria);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Vista desktop */}
                    <div className="hidden sm:block">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-accent/0">
                                        <TableHead className="w-[25%] font-semibold">Empresa</TableHead>
                                        <TableHead className="w-[20%] font-semibold">Categoría</TableHead>
                                        <TableHead className="w-[20%] font-semibold">Subcategoría</TableHead>
                                        <TableHead className="w-[8%] text-center">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {empresas?.map((empresa) => {
                                        const filteredCategories = categoriasGenerales?.filter((categoria) => categoria.empresa.nombre === empresa.nombre);
                                        const isExpanded = expandedRows[empresa.nombre] || false;
                                        
                                        return (
                                            <React.Fragment key={empresa._id}>
                                                <TableRow 
                                                    className={`${isExpanded ? "bg-accent/80 text-white hover:text-black" : ""} cursor-pointer`}
                                                    onClick={() => setExpandedRows((prev) => ({ ...prev, [empresa.nombre]: !prev[empresa.nombre] }))}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <ArrowDownWideNarrow className="w-4 h-4" />
                                                            <span className="font-medium">{empresa.nombre}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell className="text-center">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger>
                                                                <Button 
                                                                    variant="destructive"
                                                                    onClick={() => handleEliminarEmpresa(empresa)}>
                                                                    <Trash2 />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                                {isExpanded && filteredCategories?.map((categoria) => {
                                                    const filteredSubcategories = subcategoriasGenerales?.filter((subcategoria) => subcategoria?.categoria === categoria?.nombre) || [];
                                                    return (
                                                        <React.Fragment key={categoria._id}>
                                                            <TableRow className="bg-accent/20">
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
                                                                <TableRow key={subcategoria._id} className="bg-accent/20">
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}