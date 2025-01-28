import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir los tipos para el contexto
interface SidebarContextType {
  selectedItem: string | null; // Nombre del item seleccionado
  selectedCategory: string | null;
  arrayDeProductos: {id: string, nombre: string}[] | null; 
  setArrayDeProductos:(arrayDeProductos: {id: string, nombre: string}[]) => void;
  setSelectedItem: (item: string) => void; // Función para actualizar el ítem seleccionadoo
  setSelectedCategory: (category: string) => void; // Función para actualizar la categoría seleccionada
}

// Crear el contexto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Crear el proveedor del contexto
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null); //Almacena el ítem del menú actualmente seleccionado.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); //Almacena la categoría del menú actualmente seleccionada.
  const [arrayDeProductos, setArrayDeProductos] = useState<{id: string, nombre: string}[] | null>(null);
  return (
    <SidebarContext.Provider value={{  // Proporcionar los valores del contexto
      selectedItem, 
      setSelectedItem,
      selectedCategory,
      setSelectedCategory,
      arrayDeProductos,
      setArrayDeProductos 
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
