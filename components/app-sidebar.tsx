"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Shrink ,
  Hammer ,
  Package ,
  RefreshCw ,
  Fan ,
  Webhook ,
  UsersRound ,
  PencilRuler ,
} from "lucide-react"
import { useEffect, useState } from "react";
import axios from "axios";
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSidebarContext } from "@/app/context/SidebarContext";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { empresas , selectedEmpresa } = useSidebarContext();
  const [data, setData] = useState<{
    user: { name: string; email: string; avatar: string };
    teams: { name: string; logo: any; plan: string }[];
    navMain: { title: string; url: string; icon: any; items: { title: string; url: string }[] }[];
    projects: { name: string; url: string; icon: any }[];
  }>({
    user: {name: "Admin",
      email: "admin@admin.com",
      avatar: " ",},
      teams: empresas?.map((empresa, index) => ({
      name: empresa.nombre,
      logo: index === 0 ? GalleryVerticalEnd : AudioWaveform,
      plan: "",
    })) || [],
    navMain: [],
    projects: [{
      name: "Usuarios",
      url: "#",
      icon: UsersRound ,
    },
    {
      name: "Productos",
      url: "#",
      icon: PencilRuler,
    },
    {
      name: "Configuración",
      url: "#",
      icon: Frame,
    },],
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4108/catGeneral");
        //TODO sacar la bandera
        console.log("Empresa Seleccionada "+ selectedEmpresa)
        console.log("Bandera Categorias" + JSON.stringify(response.data.data, null, 2));
        const filteredCategoria= response.data.data.filter((cat: any) => cat?.empresa?.includes(selectedEmpresa));
        console.log("filteredCategoria" + JSON.stringify(filteredCategoria, null, 2));
     
        const newNavMain = filteredCategoria.map((cat: any) => {
          //console.log(cat);
          const icon = (cat.nombre === "pesca") ? Webhook : (cat.nombre === "corte") ? Fan : (cat.nombre === "impacto") ? Shrink : (cat.nombre === "reparacion") ? Hammer : (cat.nombre === "recoleccion") ? Package : (cat.nombre === "rotacion") ? RefreshCw : Settings2;
            return {
            title: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1).toLowerCase(),
            url: "#",
            icon: icon,
            items: cat.subcategorias.map((subcat: any) => {
              return {
              title: subcat.charAt(0).toUpperCase() + subcat.slice(1).toLowerCase(),
              url: "#",
              };
            }),
            };
        });
        //console.log("newNavMain" + JSON.stringify(newNavMain, null, 2));
        
        setData((prevData) => {
          return {
            ...prevData,
            navMain: newNavMain,
          };
        });
        
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    }
  
    fetchData();
  }, [selectedEmpresa]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto scrollbar-hide "> {/*hover:scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300*/}
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
