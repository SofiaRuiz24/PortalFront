"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useSidebarContext } from "@/app/context/SidebarContext";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { stringify } from "querystring";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const {
    selectedCategory, 
    setBanderaFiltradoProductos, 
    banderaFiltradoProductos, 
    setSelectedItem, 
    setSelectedCategory, 
    setSelectedSubCategory,
    setIsOpen
  } = useSidebarContext();
  //console.log('NavMain'+JSON.stringify(items,null, 2)); // Usar JSON.stringify para imprimir los objetos de manera legible);
  const handleSidebarMenuClick = (categoryTitle: string, itemTitle: string) => {
    setSelectedCategory(categoryTitle);
    setSelectedSubCategory(itemTitle);
    setSelectedItem("");
    
    // Cerrar la barra lateral en móvil
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }
  const handleSidebarMenu = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setSelectedSubCategory("");
    setSelectedItem("");
    //console.log('SidebarMenu clicked');
    setBanderaFiltradoProductos(true);
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={banderaFiltradoProductos && item.title === selectedCategory}
            //defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} onClick={() => handleSidebarMenu(item.title)}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url} onClick={() => handleSidebarMenuClick(item.title, subItem.title)}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
