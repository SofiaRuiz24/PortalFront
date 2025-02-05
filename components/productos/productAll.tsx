import React, { useEffect, useState , useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Image } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
  
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import  Documentos  from "../../app/types/documentosType";
import  Category  from "../../app/types/categoryType";
import SubCategory from "@/app/types/subCategoryType";

export function ProductAll() {
    //Estado para el manejo de categorias
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const formRef = useRef<HTMLFormElement>(null); // REF para limpiar el formulario
    const [ documentosPreview, setDocumentosPreview ] = useState<Documentos[]>([]); // Vista previa de los documentos
    const [isSubmittingUnits, setIsSubmittingUnits] = useState(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
    const [tipoDoc, setTipoDoc] = useState("");
    const [categorias, setCategorias] = useState<Array<Category>>([]);
    const [subcategorias, setSubcategorias] = useState<Array<string>>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Category | null>(null);

    //Función para obtener las categorias de la API
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:4108/catGeneral");
                console.log("Categorias cargadas:", response.data.data); // Debug
                setCategorias(response.data.data);
            } catch (error) {
                console.error("Error al obtener las categorias:", error);
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
         setSubcategorias(categoriaSeleccionada?.subcategorias || []);
         console.log("Subcategorias cargadas:", categoriaSeleccionada?.subcategorias); // Debug
    }, [categoriaSeleccionada]);
    

    //Función para obtener los productos de la API
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:4108/productos");
            console.log("Productos cargados:", response.data.data); // Debug
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    //Ejecuta fetchProducts cuando isSuccess cambia
    useEffect(() => {
        fetchProducts();
    }, [isSuccess]);
   
    //Guarda los productos en la base de datos
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSuccess(false);
        setIsSubmitting(true);//Desactiva el boton de guardar
        const formData = new FormData(e.currentTarget);
    
        try {

            formData.delete("product-img");

            // Agregar documentos si existen
            await Promise.all(documentosPreview.map(async (doc) => {
                const response = await fetch(doc.pdf);
                const blob = await response.blob();
                const file = new File([blob], doc.nombre, { type: "image/*" });
                formData.append("product-img", file);
            }));
    
            const response = await axios.post("http://localhost:4108/productos", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Respuesta del servidor:", response);
    
            // Validar por status en lugar de response.data.data
            if (response.status >= 200 && response.status < 300) { 
                toast({
                    title: "Éxito",
                    description: "Producto guardado correctamente",
                    variant: "default",
                    duration: 5000,
                });
    
                setIsSuccess(true);
                fetchProducts(); 
    
                // Limpiar formulario
                setTimeout(() => {
                    formRef.current?.reset();
                    setDocumentosPreview([]);
                    setSelectedCategory("");
                    setIsSuccess(false);
                }, 1000);
    
            } else {
                throw new Error("Respuesta inesperada del servidor");
            }
            
        } catch (error) {
            console.error("Error al guardar el producto:", error);
    
            toast({
                title: "Error",
                description: "Error al guardar el producto",
                variant: "destructive",
                duration: 5000,
            });
        }finally{
            setIsSubmitting(false); //Activa el boton de guardar
        }
    };
    
    //Guarda las unidades en la base de datos
    const handleSubmitUnidades = async (e: React.FormEvent<HTMLFormElement>, producto:string) => {
        e.preventDefault();
        setIsSubmittingUnits(true); // Deshabilitar botón
        
        const formData = new FormData(e.currentTarget);
        formData.append("producto", producto);

          // Validar que todos los campos estén completos
          const nSerie = formData.get("nSerie");
          const antiguedad = formData.get("antiguedad");
          //const unitDocs = formData.getAll("unit-docs");
  
          if (!nSerie || !antiguedad) {
              toast({
                  title: "Error",
                  description: "Por favor, complete todos los campos antes de confirmar.",
                  variant: "destructive",
                  duration: 5000,
              });
              setIsSubmittingUnits(false); // Habilitar botón
              return;
          }
          
        try {
            const response = await axios.post("http://localhost:4108/unidades", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status >= 200 && response.status < 300) {
                toast({
                    title: "Éxito",
                    description: "Unidades guardadas correctamente",
                    variant: "default",
                    duration: 5000,
                });
                
                // Limpiar el formulario antes de cerrar el diálogo
                const form = e.currentTarget;
                //form.reset();
                
            } else {
                throw new Error("Respuesta inesperada del servidor");
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Error al guardar las unidades",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsSubmittingUnits(false); // Habilitar botón
        }
    };

    //Función para cargar los documentos
    const handleDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newDocs = Array.from(files).map((file) => ({
                pdf: URL.createObjectURL(file),
                nombre: file.name,
            }));
    
            // Evitar duplicados: Filtrar los archivos que ya están en la lista
            setDocumentosPreview(prevDocs => {
                const existingNames = new Set(prevDocs.map(doc => doc.nombre));
                const filteredDocs = newDocs.filter(doc => !existingNames.has(doc.nombre));
                return [...prevDocs, ...filteredDocs];
            });
        }
    };
    
    //Función para eliminar un producto
    const handleDelete = async (productId: string) => {
        setIsSubmittingDelete(true);
        try {
            // Eliminar el producto y sus unidades
            const response = await axios.delete(`http://localhost:4108/productos/${productId}`);
            

            if (response.status >= 200 && response.status < 300) {
                toast({
                    title: "Éxito",
                    description: "Producto y sus unidades eliminados correctamente",
                    variant: "default",
                    duration: 5000,
                });

                // Actualizar la lista de productos
                fetchProducts();
            } else {
                throw new Error("Error al eliminar el producto y sus unidades");
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Error al eliminar el producto y sus unidades",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsSubmittingDelete(false);
        }
    };
    
    const handleCategoriaSeleccionada = (value: string) => {
        const categoria = categorias.find((categoria) => categoria.nombre === value);
        setCategoriaSeleccionada(categoria || null);
        console.log("Categoria seleccionada:", value);
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Formulario de Producto */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Agregar Nuevo Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form 
                        ref={formRef}
                        onSubmit={handleSubmit}
                        action="http://localhost:4108/productos"
                        method="post" 
                        encType="multipart/form-data"
                        className="space-y-8 max-w-4xl mx-auto"
                    >
                        {/* Nombre del Producto */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre del Producto</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                placeholder="Ingrese el nombre del producto"
                                required
                                className="w-full"
                            />
                        </div>

                        {/* Categoría y Subcategoría */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoría</Label>
                                <Select name="categoria" onValueChange={handleCategoriaSeleccionada}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria._id} value={categoria.nombre}>
                                                {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {categoriaSeleccionada && 
                            <div className="space-y-2">
                                <Label htmlFor="subcategoria">Subcategoria</Label>
                                <Select name="subcategoria">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una subcategoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {subcategorias.map((subcategoria) => (
                                        <SelectItem key={subcategoria} value={subcategoria}>
                                            {subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1)}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="w-full min-h-[120px] p-3 border rounded-md resize-y"
                                placeholder="Describe el producto"
                                required
                            />
                        </div>

                        {/* Imágenes */}
                        <div className="space-y-4">
                            <Label htmlFor="imagen" className="text-sm font-medium">
                                Imágenes del Producto
                            </Label>
                            <div className="relative">
                                <input
                                    id="imagen"
                                    name="product-img"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleDocs}
                                />
                                <label
                                    htmlFor="imagen"
                                    className="flex  items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors w-full"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-800"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-800">Seleccionar Imágenes</span>
                                </label>
                            </div>

                            {/* Vista previa de imágenes */}
                            {documentosPreview.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-3">Imágenes seleccionadas:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {documentosPreview.map((doc, index) => (
                                            <div 
                                                key={index} 
                                                className="relative group rounded-lg border border-gray-400 p-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDocumentosPreview(prevDocs => 
                                                            prevDocs.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                                                >
                                                    <svg 
                                                        className="w-3 h-3" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2.5" 
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                                                        <img 
                                                            src={doc.pdf} 
                                                            alt={doc.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-700 truncate flex-1">
                                                        {doc.nombre}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botón Submit */}
                        <div className="flex justify-center pt-4">
                            <Button 
                                type="submit" 
                                className="px-6 py-2 text-sm font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Producto"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tabla de Productos */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl mb-4">Lista de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[25%] font-semibold">Nombre</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Categoría</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Subcategoria</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Acciones</TableHead>
                                    <TableHead className="w-[15%] font-semibold">Eliminar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.map((product: any) => (
                                    <TableRow key={product._id} className="hover:bg-accent/50">
                                        <TableCell className="font-medium">{product.nombre}</TableCell>
                                        <TableCell>
                                            {product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)}
                                        </TableCell>
                                        <TableCell>
                                            {product.subcategoria.charAt(0).toUpperCase() + product.subcategoria.slice(1)}
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger className="bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded-lg transition-colors duration-200">
                                                    Agregar Unidades
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[500px] bg-white">
                                                    <DialogHeader className="space-y-3">
                                                        <DialogTitle className="text-xl">Editar unidades</DialogTitle>
                                                        <DialogDescription>
                                                            Agregue las unidades del producto. Haga click en confirmar al terminar.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form 
                                                        action="http://localhost:4108/unidades" 
                                                        method="post" 
                                                        className="space-y-6" 
                                                        encType="multipart/form-data" 
                                                        onSubmit={(e) => handleSubmitUnidades(e, product._id)}
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="nSerie">Numero de Serie</Label>
                                                                <Input
                                                                    id="nSerie"
                                                                    name="nSerie"
                                                                    required
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="antiguedad">Año</Label>
                                                                <Input
                                                                    id="antiguedad"
                                                                    name="antiguedad"    
                                                                    required
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {/* Documentos Upload Section */}
                                                            {['patente', 'certificadoA', 'certificadoB', 'certificadoC'].map((docType) => (
                                                                <div key={docType} className="space-y-2">
                                                                    <Label htmlFor={docType} className="capitalize">
                                                                        {docType === 'patente' ? 'Patente' : `Certificado ${docType.slice(-1)}`}
                                                                    </Label>
                                                                    <div className="relative">
                                                                        <input
                                                                            id={docType}
                                                                            name={docType}
                                                                            type="file"
                                                                            accept="application/pdf"
                                                                            className="hidden"
                                                                            onChange={(e) => {
                                                                                const fileName = e.target.files?.[0]?.name;
                                                                                const fileLabel = document.querySelector(`label[for="${docType}"] span`);
                                                                                if (fileLabel && fileName) {
                                                                                    fileLabel.textContent = fileName;
                                                                                }
                                                                            }}
                                                                        />
                                                                        <label
                                                                            htmlFor={docType}
                                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors w-full"
                                                                        >
                                                                            <svg
                                                                                className="w-5 h-5 text-gray-500"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M12 4v16m8-8H4"
                                                                                />
                                                                            </svg>
                                                                            <span className="text-sm text-gray-500 truncate">
                                                                                Seleccionar archivo
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <DialogFooter>
                                                            <Button 
                                                                type="submit" 
                                                                className="bg-primary text-white hover:bg-primary/90 transition-colors"
                                                                disabled={isSubmittingUnits}
                                                            >
                                                                {isSubmittingUnits ? "Guardando..." : "Confirmar"}
                                                            </Button>
                                                        </DialogFooter>   
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product._id)}
                                                className=" bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-3"
                                                disabled={isSubmittingDelete}
                                            >
                                                {isSubmittingDelete ? "Eliminando..." : "Eliminar"}
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}            
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}