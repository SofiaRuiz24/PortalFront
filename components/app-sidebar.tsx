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
  SquareTerminal,
} from "lucide-react"

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
const data = {
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
  navMain: [
    {
      title: "Pesca",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
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
      icon: Bot,
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
      icon: BookOpen,
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
      icon: Settings2,
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
          icon: Settings2,
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
      icon: Settings2,
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
      icon: Frame,
    },
    {
      name: "Productos",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Categorias",
      url: "#",
      icon: Map,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
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
