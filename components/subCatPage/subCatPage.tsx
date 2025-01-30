"use client"
import { useSidebarContext } from "@/app/context/SidebarContext"
import axios from "axios";
import React, { use, useEffect, useState } from "react"

interface Product {
  _id: string;
  nombre: string;
  imagen: { url: string , nombre: string}[];
  subcategoria: string;
  categoria: string;
  // Añade más propiedades según sea necesario
}

export function SubCatPage(props: any) {
  const { selectedCategory, selectedSubCategory, setSelectedItem , selectedItem} = useSidebarContext()
  const [ productsCategory, setProductsCategory ] = useState<Product[]>([]);
  const [ productos, setProductos ] = useState<Product[]>([]);
  const [ idCategory, setIdCategory ] = useState<string | null>(null);


  useEffect(() => {
    if(selectedSubCategory){
      return;
    }
    // Lógica para obtener los productos de la categoría seleccionada
    const fetchProducts = async () => {
     const res = await axios.get('http://localhost:4108/productos');
     console.log("Productos", res.data.data);
     const products = res.data.data;
     setProductos(products);
     const filterProducts = products.filter((product: { categoria: string }) => product.categoria === selectedCategory?.toLowerCase());
     setProductsCategory(filterProducts);
     console.log("Productos de la categoria", filterProducts);
    };
      fetchProducts();
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    // Logica para filtrar por subcategoria
    if (selectedSubCategory) {
      console.log("Subcategoria seleccionada", selectedSubCategory);
      const filterProducts = productos?.filter((product: { categoria: string }) => product.categoria === selectedCategory?.toLowerCase());
      const filteredSubProducts = filterProducts.filter((product: { subcategoria: string }) => product.subcategoria === selectedSubCategory?.toLowerCase());
      setProductsCategory(filteredSubProducts);
    }
    
  }, [selectedSubCategory, selectedItem]);

  const handleSelectedProduct = (e: React.MouseEvent<HTMLButtonElement>, product: string) => {
      // Lógica para seleccionar un producto
      console.log("Producto seleccionado", product);
      setSelectedItem(product);
  };

  return (
    <>
      {selectedCategory || selectedSubCategory ? (
        <div className="flex flex-1 flex-col gap-10 p-4 pt-0">
          <h1 className="text-3xl font-semibold ml-5">{selectedSubCategory? selectedSubCategory : selectedCategory}</h1>
          <div className="grid auto-rows-min gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {
              productsCategory.map((product) => (
                <button onClick={(e) => handleSelectedProduct(e, product._id)} key={product._id} className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg" >
                  <img src={product.imagen[0]?.url} alt={product.imagen[0]?.nombre} className="h-full w-full object-cover"/>
                  <span className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-2 text-center text-sm truncate">{product.nombre}</span>
                </button>
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