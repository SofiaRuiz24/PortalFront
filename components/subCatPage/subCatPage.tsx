"use client"
import { useSidebarContext } from "@/app/context/SidebarContext"
import axios from "axios";
import React, { use, useEffect, useState } from "react"

interface Product {
  id: number;
  // Añade más propiedades según sea necesario
}

export function SubCatPage(props: any) {
  const { selectedCategory, selectedSubCategory, selectedItem } = useSidebarContext()
  const [ productsCategory, setProductsCategory ] = useState<Product[]>([]);
  const [ idCategory, setIdCategory ] = useState<string | null>(null);


  useEffect(() => {
    // Lógica para obtener los productos de la categoría seleccionada
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:4108/catGeneral');
      const idCategorie = res.data.data.find((category: { nombre: string }) => category.nombre === selectedCategory);
      setIdCategory(idCategorie?._id);
    };
      fetchProducts();
  }, []);

  useEffect(() => {
    // Lógica para obtener los productos de la categoría seleccionada
    const fetchProducts = async () => {
      //todos los productos de todas las categorias deben ser obtenidos
      const res = await axios.get('http://localhost:4108/catGeneral/'+ {idCategory});
      
      const products = res.data.data.map((product: { id: number , imagen: Buffer[]}) => ({
        id: product.id,
        imagen: product.imagen,
        // Añade más propiedades según sea necesario
      }));
      setProductsCategory(products)
    };
      fetchProducts();
  }, []);

  return (
    <>
      {selectedCategory && selectedSubCategory ? (
        <div className="flex flex-1 flex-col gap-10 p-4 pt-0">
          <h1 className="text-3xl font-semibold ml-5">{selectedSubCategory}</h1>
          <div className="grid auto-rows-min gap-5 md:grid-cols-5">
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-10 p-4 pt-0">
          <h1 className="text-3xl font-semibold ml-5">{selectedCategory}</h1>
          <div className="grid auto-rows-min gap-5 md:grid-cols-5">
            {productsCategory.map((product) => (
              <div key={product.id} className="aspect-[2/3] rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      )}
    </>
  )
}