"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  CircleHelp ,
  SquareUserRound 
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import axios from "axios"
import { useSidebarContext } from "@/app/context/SidebarContext"
import { signOut, useSession } from "next-auth/react"
import "dotenv/config";
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const {status , data: session} = useSession() as { status: string, data: { accessToken: string } | null }
  const { isMobile } = useSidebar()
  //const { setSession } = useSidebarContext();
  const handleLogout = async () => {
    try {
      // Cierra la sesión en NextAuth
      await signOut({ redirect: false });
  
      const idToken = localStorage.getItem("id_token") || sessionStorage.getItem("id_token");

      //console.log(localStorage.getItem("id_token"));
      //console.log(sessionStorage.getItem("id_token"));

      let keycloakLogoutUrl = `http://localhost:8080/realms/sasha/protocol/openid-connect/logout?client_id=sasha-cliente&post_logout_redirect_uri=http://localhost:3000/`;
      
      if (idToken) {
          keycloakLogoutUrl += `&id_token_hint=${idToken}`;
      }
      
      
     
      // Redirige directamente a la pantalla de login sin la página de confirmación de Keycloak
      window.location.href = keycloakLogoutUrl;
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-background2 text-sidebar-foreground">AD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg ml-1"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px- py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-background2 text-sidebar-foreground">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                
                <Bell />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SquareUserRound  />
                Perfil
              </DropdownMenuItem>
             {/*} <DropdownMenuItem>
                <CreditCard />
                En Alquiler
              </DropdownMenuItem>*/}
              <DropdownMenuItem>
              <CircleHelp  />
                Contacto / Ayuda
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem  onClick={handleLogout}>
               <LogOut/>
                Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
