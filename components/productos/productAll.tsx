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
          const unitDocs = formData.getAll("unit-docs");
  
          if (!nSerie || !antiguedad || unitDocs.length === 0) {
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
                                        <SelectItem value="remediacion">Remediacion</SelectItem>
                                        <SelectItem value="accesorios">Accesorios</SelectItem>
                                        <SelectItem value="diagnostico">Diagnostico</SelectItem>
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
                                <TableHead>Eliminar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product: any) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.nombre}</TableCell>
                                    <TableCell>
                                        {product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)}
                                    </TableCell>
                                    <TableCell>
                                        {product.subcategoria.charAt(0).toUpperCase() + product.subcategoria.slice(1)}
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger className="bg-accent/80 text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                                                Agregar Unidades
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-white p-8">
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
                                                    <div>
                                                        <Label htmlFor="tipoDoc">Tipo de Documento</Label>
                                                        <select name="selectDoc" id="selectDoc" onChange={(e) => setTipoDoc(e.target.value)} className="w-full p-2 border rounded-md">
                                                            <option value="">Seleccione un tipo de documento</option>
                                                            <option value="patente">Patente</option>
                                                            <option value="certificadoA">Certificado A</option>
                                                            <option value="certificadoB">Certificado B</option>
                                                            <option value="certificadoC">Certificado C</option>
                                                        </select>
                                                    </div>
                                                    { tipoDoc.includes("patente") ?
                                                    <div className="space-y-2">
                                                        <Label htmlFor="patente">Patente</Label>
                                                        <Input
                                                            id="patente"
                                                            name="patente"
                                                            type="file"
                                                            accept="application/pdf"
                                                            className="cursor-pointer"   
                                                        />
                                                    </div>:( tipoDoc.includes("certificadoA")?
                                                    <div className="space-y-2">
                                                        <Label htmlFor="certificadoA">Certificado A</Label>
                                                        <Input
                                                            id="certificadoA"
                                                            name="certificadoA"
                                                            type="file"
                                                            accept="application/pdf"
                                                            className="cursor-pointer"   
                                                        />
                                                    </div>:( tipoDoc.includes("certificadoB")?
                                                    <div className="space-y-2">
                                                        <Label htmlFor="certificadoB">Certificado B</Label>
                                                        <Input
                                                            id="certificadoB"
                                                            name="certificadoB"
                                                            type="file"
                                                            accept="application/pdf"
                                                            className="cursor-pointer"   
                                                        />
                                                    </div>:( tipoDoc.includes("certificadoC")?
                                                    <div className="space-y-2">
                                                        <Label htmlFor="unit-docs">Certificado C</Label>
                                                        <Input
                                                            id="certificadoC"
                                                            name="certificadoC"
                                                            type="file"
                                                            accept="application/pdf"
                                                            multiple
                                                            className="cursor-pointer"   
                                                        />
                                                    </div>:  null
                                                    )))}
                                                    <DialogFooter>
                                                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/70 transition-all" disabled={isSubmittingUnits}>
                                                            Confirmar
                                                        </button>
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
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {isSubmittingDelete ? "Eliminando..." : "Eliminar"}
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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