import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir los tipos para el contexto
interface SidebarContextType {
  selectedItem: string | null; // Nombre del item seleccionado
  setSelectedItem: (item: string) => void; // Función para actualizarlo
}

// Crear el contexto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Crear el proveedor del contexto
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <SidebarContext.Provider value={{ selectedItem, setSelectedItem }}>
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
