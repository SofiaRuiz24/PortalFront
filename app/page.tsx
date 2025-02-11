"use client";

import AppPage from "./appPage/appPage";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { useSession, signIn, signOut } from "next-auth/react";

/*export default function Home() {
   return (
    <SidebarProvider>
      <AppPage />
    </SidebarProvider>
)}*/


export default function Home() {
  const { status, session, signIn } = useSession();
if (status === "loading") {
  return <div>Loading...</div>;
  
}
if(session){
  return (
    <SidebarProvider>
      <AppPage />
    </SidebarProvider>
  );
}

return (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary2-600 dark:text-primary2-500">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Sesión no encontrada.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Algo salió mal. Redirijase al ingreso para entrar al portal.</p>
            <a href="#" className="inline-flex text-white bg-primary2-600 hover:bg-primary2-800 focus:ring-4 focus:outline-none focus:ring-primary2-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary2-900 my-4">Ingresar</a>
        </div>   
    </div>
</section>
);
}
 