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

export function ProductAll() {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const formRef = useRef<HTMLFormElement>(null); // REF para limpiar el formulario
    const [ documentosPreview, setDocumentosPreview ] = useState<Documentos[]>([]); // Vista previa de los documentos

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
   
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSuccess(false);
    
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
        }
    };
    
    

    const handleSubmitUnidades = async (e: React.FormEvent<HTMLFormElement>, producto:string) => {
        e.preventDefault(); // Evita la recarga de la página y la redirección automática
        const formData = new FormData(e.currentTarget); // Captura todos los datos del formulario
        formData.append("producto", producto);
        try {
            const response = await axios.post("http://localhost:4108/unidades", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Respuesta:", response);
            alert("Unidades guardadas correctamente");
        } catch (error) {
            console.error("Error:", error);
        }
    };
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
    
    

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Formulario de Producto */}
            <Card>
                <CardHeader>
                    <CardTitle>Agregar Nuevo Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form 
                        ref={formRef}
                        onSubmit={handleSubmit}
                        action="http://localhost:4108/productos" // URL de la API
                        method="post" 
                        encType="multipart/form-data" // Necesario para enviar archivos
                        className="space-y-6"
                    >
                        <div className="space-y-2 w-1/2">
                                <Label htmlFor="nombre">Nombre del Producto</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingrese el nombre del producto"
                                    required
                                />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoría</Label>
                                <Select name="categoria">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pesca">Pesca</SelectItem>
                                        <SelectItem value="corte">Corte</SelectItem>
                                        <SelectItem value="impacto">Impacto</SelectItem>
                                        <SelectItem value="reparacion">Reparación</SelectItem>
                                        <SelectItem value="recoleccion">Recolección</SelectItem>
                                        <SelectItem value="rotacion">Rotación</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subcategoria">Subcategoria</Label>
                                <Input
                                    id="subcategoria"
                                    name="subcategoria"
                                    placeholder="Ingrese la Subcategoria del producto"
                                    required
                                />
                        </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="w-full min-h-[100px] p-2 border rounded-md"
                                placeholder="Describe el producto"
                                required
                            />
                        </div>
                        

                        <div className="space-y-2">
                            <Label htmlFor="imagen">Imagen del Producto</Label>
                            <Input
                                id="imagen"
                                name="product-img"
                                type="file"
                                accept="image/*"
                                multiple
                                className="cursor-pointer min-h-[50px] pt-3"
                                onChange={handleDocs}
                            />
                            {documentosPreview.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <ul className="list-disc pl-4">
                                        {documentosPreview.map((doc, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <Image />
                                                <a href={doc.pdf} target="_blank" rel="noopener noreferrer" className="text-black-200 hover:underline text-sm hover:text-blue-700">
                                                    {doc.nombre}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        <Button 
                            type="submit" 
                            className={`w-auto px-4 py-2 text-sm mx-auto block`}
                        >
                            Guardar Producto
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Tabla de Productos */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Subcategoria</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Ejemplo de fila - Esto se reemplazará con datos reales */}
                                {products?.map((product: any) => (
                                <TableRow >
                                 <TableCell>{product.nombre}</TableCell>
                                 <TableCell>
                                    {
                                    //Poner la primer letra a mayuscula
                                    product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)
                                    }
                                </TableCell>
                                 <TableCell>
                                    {
                                     product.subcategoria.charAt(0).toUpperCase() + product.subcategoria.slice(1)
                                    }
                                 </TableCell>
                                 <TableCell>
                                 <Dialog>
                                    <DialogTrigger  className="bg-accent/80 text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">Agregar Unidades</DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                        <DialogTitle>Editar unidades</DialogTitle>
                                        <DialogDescription>
                                            Agregue las unidades del producto.Haga click en confirmar al terminar.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <form action="http://localhost:4108/unidades" method="post" className="space-y-6" encType="multipart/form-data" onSubmit={(e) => handleSubmitUnidades(e, product._id)}>
                                        <div>
                                            <Label htmlFor="nSerie">Numero de Serie</Label>
                                            <Input
                                                id="nSerie"
                                                name="nSerie"
                                                placeholder="Ingrese el numero de serie"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="antiguedad">Año</Label>
                                            <Input
                                                id="antiguedad"
                                                name="antiguedad"
                                                placeholder="Ingrese el año del producto"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="unit-docs">Cargar Documentación</Label>
                                            <Input
                                                id="unit-docs"
                                                name="unit-docs"
                                                type="file"
                                                accept="application/pdf"
                                                multiple
                                                className="cursor-pointer"   
                                            />
                                        </div>
                                            <DialogFooter>
                                                <DialogClose type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/70 transition-all">
                                                    Confirmar
                                                </DialogClose>
                                            </DialogFooter>   
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                 </TableCell>    
                                 </TableRow>
                                ))}            
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}