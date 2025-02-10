import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import axios from "axios";

export default function ProductEdit() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Función para obtener los productos de la API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4108/productos");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  // Función para obtener la información del producto seleccionado
  const fetchProductById = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4108/productos/${id}`);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };

  // Ejecuta fetchProducts cuando el componente se monta
  useEffect(() => {
    fetchProducts();
  }, []);

  // Maneja la selección del producto
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    if (productId) {
      fetchProductById(productId);
    } else {
      setSelectedProduct(null);
    }
  };

  // Maneja la edición del producto
  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await axios.put(`http://localhost:4108/productos/${selectedProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Éxito",
          description: "Producto editado correctamente",
          variant: "default",
          duration: 5000,
        });
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al editar el producto:", error);
      toast({
        title: "Error",
        description: "Error al editar el producto",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Buscador de Producto */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Producto</CardTitle>
        </CardHeader>
        <CardContent>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue>Seleccione un producto</SelectValue> 
            </SelectTrigger>
            <SelectContent >
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.nombre}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {/* Formulario de Edición de Producto */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleEditProduct} className="space-y-6">
              <div className="space-y-2 w-1/2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  defaultValue={selectedProduct.nombre}
                  required
                />
              </div>

              <div className="space-y-2 w-1/2">
                <Label htmlFor="categoria">Categoría</Label>
                <Input
                  id="categoria"
                  name="categoria"
                  defaultValue={selectedProduct.categoria}
                  required
                />
              </div>

              <div className="space-y-2 w-1/2">
                <Label htmlFor="subcategoria">Subcategoría</Label>
                <Input
                  id="subcategoria"
                  name="subcategoria"
                  defaultValue={selectedProduct.subcategoria}
                  required
                />
              </div>

              <Button type="submit" className="w-auto px-4 py-2 text-sm mx-auto block">
                Editar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}