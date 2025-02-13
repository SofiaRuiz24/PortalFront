"use client";


import { Session } from "inspector/promises";
import AppPage from "./appPage/appPage";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { SessionProvider } from "next-auth/react";


/*export default function Home() {
   return (
    <SidebarProvider>
      <AppPage />
    </SidebarProvider>
)}*/


export default function Home() {

  return (
    <SessionProvider>
      <SidebarProvider>
        <AppPage />
      </SidebarProvider>
    </SessionProvider>
  );
}

 