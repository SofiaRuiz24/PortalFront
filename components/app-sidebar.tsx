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


export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { empresas , selectedEmpresa } = useSidebarContext();
  const [data, setData] = useState<{
    user: { name: string; email: string; avatar: string };
    teams: { name: string; logo: any; plan: string }[];
    navMain: { title: string; url: string; icon: any; items: { title: string; url: string }[] }[];
    projects: { name: string; url: string; icon: any }[];
  }>({
    user: { name: "Admin", email: "admin@admin.com", avatar: " " },
    teams: empresas?.map((empresa, index) => ({
      name: empresa.nombre,
      logo: index? (index === 0 ? GalleryVerticalEnd : AudioWaveform) : BookOpen,
      plan: "",
    })) || [],
    navMain: [],
    projects: [
      {
        name: "Usuarios",
        url: "#",
        icon: UsersRound,
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
      },
    ],
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      teams: empresas?.map((empresa, index) => ({
        name: empresa.nombre,
        logo: index === 0 ? GalleryVerticalEnd : AudioWaveform,
        plan: "",
      })) || [],
    }));
  }, [empresas]);
  useEffect(() => {
    async function fetchData() {
      
      try {
        console.log("Bandera1 " + selectedEmpresa)
        const response = await axios.get("http://localhost:4108/catGeneral");
        
        const categoriasGeneralesBandera = response?.data.data; 
        const filteredCategoria= categoriasGeneralesBandera.filter((cat: any) => cat?.empresa.nombre === selectedEmpresa);
        
      
        const newNavMain = filteredCategoria.map((cat: any) => {
          
          const icon = (cat.nombre === "pesca") ? Webhook : (cat.nombre === "corte") ? Fan : (cat.nombre === "impacto") ? Shrink : (cat.nombre === "reparacion") ? Hammer : (cat.nombre === "recoleccion") ? Package : (cat.nombre === "rotacion") ? RefreshCw : Settings2;
            return {
            title: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1).toLowerCase(),
            url: "#",
            icon: icon,
            items: cat.subcategorias?.map((subcat: any) => {
              return {
              title: subcat.nombre.charAt(0).toUpperCase() + subcat.nombre.slice(1).toLowerCase(),
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
        {role === "admin" && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
