"use client"
import { useSidebarContext } from "@/app/context/SidebarContext"
import axios from "axios";
import React, { use, useEffect, useState } from "react"

interface Product {
  _id: string;
  nombre: string;
  imagen: { url: string , nombre: string}[];
  // Añade más propiedades según sea necesario
}

export function SubCatPage(props: any) {
  const { selectedCategory, selectedSubCategory, selectedItem } = useSidebarContext()
  const [ productsCategory, setProductsCategory ] = useState<Product[]>([]);
  const [ idCategory, setIdCategory ] = useState<string | null>(null);


  useEffect(() => {
    // Lógica para obtener los productos de la categoría seleccionada
    const fetchProducts = async () => {
     const res = await axios.get('http://localhost:4108/productos');
     console.log("Productos", res.data.data);
     const products = res.data.data;
     const filterProducts = products.filter((product: { categoria: string }) => product.categoria === selectedCategory?.toLowerCase());
     setProductsCategory(filterProducts);
     console.log("Productos de la categoria", filterProducts);
    };
      fetchProducts();
  }, []);

  useEffect(() => {
    // Lógica para obtener los productos de la categoría seleccionada
    const fetchProducts = async () => {
      //todos los productos de todas las categorias deben ser obtenidos
      const res = await axios.get('http://localhost:4108/catGeneral/'+ idCategory);
      const products = res.data.data.map((product: { id: number , imagen: Buffer[]}) => ({
        id: product.id,
        imagen: product.imagen,
        // Añade más propiedades según sea necesario
      }));
      setProductsCategory(products)
    };
    if (!selectedSubCategory) {
      return;
    }
      fetchProducts();
  }, [selectedSubCategory]);

  return (
    <>
      {selectedCategory || selectedSubCategory ? (
        <div className="flex flex-1 flex-col gap-10 p-4 pt-0">
          <h1 className="text-3xl font-semibold ml-5">{selectedSubCategory? selectedSubCategory : selectedCategory}</h1>
          <div className="grid auto-rows-min gap-5 md:grid-cols-5">
            {
              productsCategory.map((product) => (
                <div key={product._id} className="aspect-[2/3] rounded-xl bg-muted" >
                  
                  <img src={product.imagen[0]?.url} alt={product.imagen[0]?.nombre} />

                  <span>{product.nombre}</span>
                  
                </div>
              ))
            }
          </div>
        </div>
      ) : (
        <p>Error</p>
      )}
    </>
  )
}