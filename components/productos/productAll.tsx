import React, { useEffect, useState , useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Image, X } from 'lucide-react';
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
  
import { Pencil, Trash2, Upload } from "lucide-react";
import axios from "axios";
import  Documentos  from "../../app/types/documentosType";
import  Category  from "../../app/types/categoryType";
import SubCategory from "@/app/types/subCategoryType";
import ProductEdit from "./productEdit";
import { useSidebarContext } from "@/app/context/SidebarContext";

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
    const [subcategorias, setSubcategorias] = useState<Array<SubCategory>>([]);
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
         //console.log("Subcategorias cargadas:", categoriaSeleccionada?.subcategorias); // Debug
    }, [categoriaSeleccionada]);
    
    const { crudProduct } = useSidebarContext();

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
    
           //console.log("Respuesta del servidor:", response);
    
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
    const handleDelete = async (productId: string , subcategoria: string) => {
        setIsSubmittingDelete(true);
        try {
            // Eliminar el producto y sus unidades
            const response = await axios.delete(`http://localhost:4108/productos/${productId}`, {
                data: { subcategoria }
              });
              
            

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
        //console.log("Categoria seleccionada:", value);
    }

    return (crudProduct?.includes("productos") ? (
        <div className="flex flex-col gap-4 sm:gap-8 p-2 sm:p-4 lg:p-8">
            {/* Formulario de Producto */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Agregar Nuevo Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form 
                        ref={formRef}
                        onSubmit={handleSubmit}
                        action="http://localhost:4108/productos"
                        method="post" 
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

                            {/* Categoría */}
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoría</Label>
                                <Select name="categoria" onValueChange={handleCategoriaSeleccionada}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria._id} value={categoria.nombre}>
                                                {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Subcategoría - Solo se muestra si hay categoría seleccionada */}
                            {categoriaSeleccionada && (
                                <div className="space-y-2">
                                    <Label htmlFor="subcategoria">Subcategoría</Label>
                                    <Select name="subcategoria">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona una subcategoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subcategorias?.map((subcategoria) => (
                                                <SelectItem key={subcategoria._id} value={subcategoria.nombre}>
                                                    {subcategoria.nombre.charAt(0).toUpperCase() + subcategoria.nombre.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    className="w-full min-h-[120px] p-3 border rounded-md resize-y bg-background"
                                    placeholder="Describe el producto"
                                    required
                                />
                            </div>

                            {/* Imágenes */}
                            <div className="space-y-4 md:col-span-2">
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
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-input hover:bg-accent/50 cursor-pointer transition-colors w-full"
                                    >
                                        <Image className="w-5 h-5" />
                                        <span className="text-sm">Seleccionar Imágenes</span>
                                    </label>
                                </div>

                                {/* Vista previa de imágenes */}
                                {documentosPreview.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-3">Imágenes seleccionadas:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {documentosPreview.map((doc, index) => (
                                                <div 
                                                    key={index} 
                                                    className="relative group rounded-lg border border-input p-3 hover:bg-accent/50 transition-colors"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDocumentosPreview(prevDocs => 
                                                                prevDocs.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 flex-shrink-0 rounded-md border overflow-hidden">
                                                            <img 
                                                                src={doc.pdf} 
                                                                alt={doc.nombre}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-sm truncate flex-1">
                                                            {doc.nombre}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <div className="flex justify-end pt-4">
                            <Button 
                                type="submit" 
                                className="px-6"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Producto"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de Productos */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Lista de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Vista móvil */}
                    <div className="block sm:hidden space-y-4">
                        {products?.map((product: any) => (
                            <div key={product._id} className="bg-secondary/10 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-medium">{product.nombre}</h3>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {product.categoria}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="w-full">
                                                    Agregar Unidades
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <UnidadesForm 
                                                    productId={product._id}
                                                    handleSubmitUnidades={handleSubmitUnidades}
                                                    isSubmittingUnits={isSubmittingUnits}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(product._id, product.subcategoria)}
                                            disabled={isSubmittingDelete}
                                        >
                                            {isSubmittingDelete ? "Eliminando..." : "Eliminar"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vista desktop */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[25%] font-semibold">Nombre</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Categoría</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Subcategoría</TableHead>
                                    <TableHead className="w-[20%] font-semibold">Acciones</TableHead>
                                    <TableHead className="w-[15%] font-semibold">Eliminar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.map((product: any) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="font-medium">{product.nombre}</TableCell>
                                        <TableCell className="capitalize">
                                            {product.categoria}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {product.subcategoria}
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        Agregar Unidades
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[500px]">
                                                    <UnidadesForm 
                                                        productId={product._id}
                                                        handleSubmitUnidades={handleSubmitUnidades}
                                                        isSubmittingUnits={isSubmittingUnits}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product._id, product.subcategoria)}
                                                disabled={isSubmittingDelete}
                                                className="w-full"
                                            >
                                                {isSubmittingDelete ? (
                                                    "Eliminando..."
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span>Eliminar</span>
                                                        <Trash2 className="h-4 w-4" />
                                                    </div>
                                                )}
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
    ) : (crudProduct?.includes("editar") ? <ProductEdit/> : null));
}

// Componente separado para el formulario de unidades
function UnidadesForm({ productId, handleSubmitUnidades, isSubmittingUnits }: {
    productId: string;
    handleSubmitUnidades: (e: React.FormEvent<HTMLFormElement>, productId: string) => void;
    isSubmittingUnits: boolean;
}) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Agregar Unidades</DialogTitle>
                <DialogDescription>
                    Complete los detalles de la unidad
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmitUnidades(e, productId)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nSerie">Número de Serie</Label>
                        <Input
                            id="nSerie"
                            name="nSerie"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="antiguedad">Año</Label>
                        <Input
                            id="antiguedad"
                            name="antiguedad"    
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
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
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input hover:bg-accent/50 cursor-pointer transition-colors w-full"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm text-muted-foreground truncate">
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
                        disabled={isSubmittingUnits}
                    >
                        {isSubmittingUnits ? "Guardando..." : "Confirmar"}
                    </Button>
                </DialogFooter>   
            </form>
        </>
    );
}