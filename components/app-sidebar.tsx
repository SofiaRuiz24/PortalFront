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

const iconComponents = {
  webhook: Webhook,
  fan: Fan,
  shrink: Shrink,
  hammer: Hammer,
  package: Package,
  refresh: RefreshCw,
  settings: Settings2,
  audioWaveform: AudioWaveform,
  bookOpen: BookOpen,
  bot: Bot,
  frame: Frame,
  galleryVerticalEnd: GalleryVerticalEnd,
  map: Map,
  pieChart: PieChart,
  usersRound: UsersRound,
  pencilRuler: PencilRuler
};

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { empresas , selectedEmpresa , banderaMenu, sesion } = useSidebarContext();
  const [data, setData] = useState<{
    user: { name: string; email: string; avatar: string; admin: boolean };
    teams: { name: string; logo: any; plan: string }[];
    navMain: { title: string; url: string; icon: any; items: { title: string; url: string }[] }[];
    projects: { name: string; url: string; icon: any }[];
  }>({
    //TODO : BORRAR ADMIN
    user: { 
      name: sesion?.name?.charAt(0).toUpperCase() + sesion?.name?.slice(1) || "Admin" , 
      email: sesion?.email || "admin@admin.com", 
      avatar: sesion?.name.slice(0) || " ", 
      admin:( role === "admin") ? true : false
    },
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
  //console.log("Role: " + role);
  //console.log("UserAdmin=: " + data.user.admin);
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
        const response = await axios.get("https://t72m2pk3-4108.brs.devtunnels.ms/catGeneral");
        
        const categoriasGeneralesBandera = response?.data.data; 
        const filteredCategoria= categoriasGeneralesBandera.filter((cat: any) => cat?.empresa.nombre === selectedEmpresa);
        
      
        const newNavMain = filteredCategoria.map((cat: any) => {
          const IconComponent = iconComponents[cat.icon as keyof typeof iconComponents] || Settings2;
          return {
            title: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1).toLowerCase(),
            url: "#",
            icon: IconComponent,
            items: cat.subcategorias?.map((subcat: any) => ({
              title: subcat.nombre.charAt(0).toUpperCase() + subcat.nombre.slice(1).toLowerCase(),
              url: "#",
            })),
          };
        });
        console.log("newNavMain" + JSON.stringify(newNavMain, null, 2));
        
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
  }, [selectedEmpresa , banderaMenu]);
  
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
