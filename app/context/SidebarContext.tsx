import React, { createContext, useContext, useState, ReactNode } from "react";
import User from "../types/userType";
import Empresa from "../types/empresasTypes";

// Definir los tipos para el contexto
interface SidebarContextType {
  selectedItem: string | null; // Nombre del item seleccionado
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  arrayDeProductos: {id: string, nombre: string}[] | null; 
  selectedAdmin: string | null; // Nombre del item seleccionado
  sesion:User | null;
  crudProduct: string | null; // Nombre del crud seleccionado
  empresas: Empresa[] | null;
  selectedEmpresa: string | null; // Nombre de la empresa seleccionada
  banderaMenu: string | null; 
  banderaFiltradoProductos: boolean; // Bandera de filtrado de productos
  setBanderaFiltradoProductos: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar la bandera de filtrado de productos
  setArrayDeProductos: React.Dispatch<React.SetStateAction<{id: string, nombre: string}[] | null>>;
  setSelectedItem: (item: string) => void; // Función para actualizar el ítem seleccionadoo
  setSelectedCategory: (category: string) => void; // Función para actualizar la categoría seleccionada
  setSelectedAdmin: (admin: string) => void; // Función para actualizar el ítem seleccionado
  setSelectedSubCategory: (subCategory: string) => void; // Función para actualizar la subcategoría seleccionada
  setSesion: (sesion: User) => void; // Función para actualizar la sesion del usuario
  setCrudProduct: (crudProduct: string) => void; // Función para actualizar el crud seleccionado
  setEmpresas: React.Dispatch<React.SetStateAction<Empresa[] | null>>; // Función para actualizar las empresas
  setSelectedEmpresa: (empresa: string) => void; // Función para actualizar la empresa seleccionada
  setBanderaMenu: (bandera: string) => void; // Función para actualizar la bandera del menú
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Crear el proveedor del contexto
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null); //Almacena el ítem del menú actualmente seleccionado.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); //Almacena la categoría del menú actualmente seleccionada.
  const [arrayDeProductos, setArrayDeProductos] = useState<{id: string, nombre: string}[] | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[] | null>(null); //Almacena las empresas del menú actualmente seleccionadas.
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null); //Almacena el ítem del menú actualmente seleccionado.
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null); //Almacena la empresa del menú actualmente seleccionada.
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null); //Almacena la subcategoría del menú actualmente seleccionada.
  const [sesion, setSesion] = useState<User | null>(null); //Almacena la sesion del usuario.
  const [crudProduct, setCrudProduct] = useState<string | null>(null); //Almacena el crud del producto actualmente seleccionado.
  const [menuCategorias, setMenuCategorias] = useState<string[] | null>(null); //Almacena las categorías del menú actualmente seleccionadas.
  const [banderaFiltradoProductos, setBanderaFiltradoProductos] = useState<boolean>(false); //Almacena la bandera del menú actualmente seleccionada.
  const [banderaMenu, setBanderaMenu] = useState<string>("No Cambio"); //Almacena la bandera del menú actualmente seleccionada.
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{  // Proporcionar los valores del contexto
      sesion,
      setSesion,
      empresas,
      setEmpresas,
      selectedEmpresa,
      setSelectedEmpresa,
      selectedItem, 
      setSelectedItem,
      selectedCategory,
      setSelectedCategory,
      arrayDeProductos,
      setArrayDeProductos,
      selectedAdmin,
      setSelectedAdmin,
      selectedSubCategory,
      setSelectedSubCategory,
      crudProduct,
      setCrudProduct,
      banderaMenu,
      setBanderaMenu,
      banderaFiltradoProductos, 
      setBanderaFiltradoProductos,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook para usar el contexto
export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext debe usarse dentro de un SidebarProvider");
  }
  return context;
};
