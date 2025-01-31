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

// This is sample data.
/*const data = {
  user: {
    name: "Admin",
    email: "admin@admin.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ORTUBIA",
      logo: GalleryVerticalEnd,
      plan: "",
    },
    {
      name: "SEPESUR",
      logo: AudioWaveform,
      plan: "",
    },
  ],
  //en vez de data estatica que lo traiga de la base de datos
  navMain: [
    {
      title: "Pesca",
      url: "#",
      icon: Webhook ,
      items: [
        {
          title: "Externa",
          url: "#",
        },
        {
          title: "Interna",
          url: "#",
        },
      ],
    },
    {
      title: "Corte",
      url: "#",
      icon: Fan ,
      items: [
        {
          title: "Cortador mecanico interior",
          url: "#",
        },
        {
          title: "Cortador mecanico exterior",
          url: "#",
        },
      ],
    },
    {
      title: "Impacto",
      url: "#",
      icon: Shrink,
      items: [
        {
          title: "Intensificador de golpe hidraulico",
          url: "#",
        },
        {
          title: "Tijera de pesca",
          url: "#",
        },
      ],
    },
    {
      title: "Reparacion",
      url: "#",
      icon: Hammer,
      items: [
        {
          title: "Impresor de plomo",
          url: "#",
        },
        {
          title: "Rascador de cañeria",
          url: "#",
        },
      ],
    },
    {
          title: "Recoleccion",
          url: "#",
          icon: Package ,
          items: [
            {
              title: "Pescador Arpon",
              url: "#",
            },
            {
              title: "Pescador Canasta",
              url: "#",
            },
          ],
    },
    {
      title: "Rotacion",
      url: "#",
      icon: RefreshCw ,
      items: [
        {
          title: "Fresa canónica",
          url: "#",
        },
        {
          title: "Fresa plana",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
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
      name: "Categorias",
      url: "#",
      icon: Frame,
    },
    
  ],
}*/

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const [data, setData] = useState<{
    user: { name: string; email: string; avatar: string };
    teams: { name: string; logo: any; plan: string }[];
    navMain: { title: string; url: string; icon: any; items: { title: string; url: string }[] }[];
    projects: { name: string; url: string; icon: any }[];
  }>({
    user: {name: "Admin",
      email: "admin@admin.com",
      avatar: "/avatars/shadcn.jpg",},
    teams: [{
      name: "ORTUBIA",
      logo: GalleryVerticalEnd,
      plan: "",
    },
    {
      name: "SEPESUR",
      logo: AudioWaveform,
      plan: "",
    },],
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
      name: "Categorias",
      url: "#",
      icon: Frame,
    },],
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4108/catGeneral");
        console.log("Bandera" + response.data);
        const newNavMain = response.data.data.map((cat: any) => {
          console.log(cat);
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
  }, []);
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
