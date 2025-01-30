import React, { useEffect, useState , useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export function ProductAll() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const formRef = useRef<HTMLFormElement>(null); // REF para limpiar el formulario

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
        e.preventDefault(); // Evita la recarga de la página y la redirección automática
        setIsSuccess(false);
        const formData = new FormData(e.currentTarget); // Captura todos los datos del formulario
        
        try {
            const response = await axios.post("http://localhost:4108/productos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            /* Si response.data y response.data.data existen (es decir, no son null, undefined ni falsos)
             entonces ejecuta la función fetchProducts()*/ 

            if (response.data && response.data.data) {
                // Volver a cargar los productos desde el servidor para asegurar de tener la lista actualizada
                fetchProducts();
            } else {
                console.error("Error: la respuesta del servidor no contiene datos válidos.");
            }
             
            
            //Limpiar el formulario
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.reset();
                }
            }, 1000);
  
            //Resetear estado del botón después de éxito
              setIsSuccess(true);
              setTimeout(() => setIsSuccess(false), 1000);

        } catch (error) {
            console.error("Error:", error);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre del Producto</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingrese el nombre del producto"
                                    required
                                />
                            </div>

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
                                <Label htmlFor="subcategoria">Subcategoria</Label>
                                <Input
                                    id="subcategoria"
                                    name="subcategoria"
                                    placeholder="Ingrese la Subcategoria del producto"
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
                                className="cursor-pointer"
                            
                            />
                            
                            <div className="mt-2 hidden">
                                <img
                                    src=""
                                    alt="Vista previa"
                                    className="max-w-xs rounded-lg"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className={`w-auto px-4 py-2 text-sm ${isSuccess ? 'bg-green-500' : ''} mx-auto block`}
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
                                    <DialogTrigger><Button variant='outline'>Agregar Unidades</Button></DialogTrigger>
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
                                                <DialogClose asChild>
                                                    <Button type="submit">Confirmar</Button>
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