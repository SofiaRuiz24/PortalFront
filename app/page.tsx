"use client";

import { SessionProvider } from "next-auth/react";
import AppPage from "./appPage/appPage";
import { SidebarProvider } from "@/app/context/SidebarContext";


/*export default function Home() {
   return (
    <SidebarProvider>
      <AppPage />
    </SidebarProvider>
)}*/


export default function Home() {

  return (

      <SidebarProvider>
        <AppPage />
      </SidebarProvider>
    
  );
}

 