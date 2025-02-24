'use client';

import React, { useEffect, useState } from "react";
import PageDashboard from "../dashboard/page";
import LoginPage from "../login/page";
import axios from "axios";
import { useSidebarContext } from "@/app/context/SidebarContext";
import { useSession, signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import User from "../types/userType";
import { Progress } from "@/components/ui/progress"

export default function AppPage() {
    const {empresas, sesion , setSesion, setEmpresas ,setSelectedEmpresa } = useSidebarContext();
    const { status, data: session } = useSession();
    const [progress, setProgress] = useState(13);
  
    
    const sesionUsuario = async () => {
      if(!session?.user?.email) return;
      try {
        const response = await axios.get("http://localhost:4108/login", {
          params: {
            email: session?.user?.email,
          },
        });
        //console.log(response.data);
        const auxUser = response.data.user;
        //console.log(auxUser);
        const user1: User = { 
          email: auxUser.email,
          role: auxUser.rol,
          name: auxUser.nombre,
          empresas: auxUser.empresas || [],
          idKey: auxUser.idKey,
        }
        setSesion(user1);
        
      } catch (error) {
        console.log("Error al verificar la sesión");
        console.log(error);     
      }
    };

    useEffect(() => {
      const fetchEmpresas = async () => {
      try {
        const response = await axios.get("http://localhost:4108/empresas");
        //const companyNames = response.data.data.map((company: any) => company.nombre);
        const companyNames = response.data.data;
        setEmpresas(companyNames);
        //console.log("Nombre de la empresa: ",companyNames);
      } catch (error) {
        console.log("Error fetching companies", error);
      }
      };
      fetchEmpresas();
    }, []);

    useEffect(() => {
     setSelectedEmpresa(empresas? empresas[0]?.nombre  : "");
    },[empresas]);

    useEffect(() => {
      const fetchSession = async () => {
        //console.log(session);
        //console.log(token);
        if (session?.user?.email) {
          console.log("Sesion ingresada: ",session?.user?.email);
          await sesionUsuario();
        }
      };
      fetchSession();
      //console.log("Sesion ingresada: ",sesion?.role);
    }, [status]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(66);
      }, 500);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(100);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);

    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background2 p-4">
          <div className="w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-center text-white mb-4">
              Cargando...
            </h2>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      );
    } else if (session && session.user) {
        return sesion?.role?.includes("admin")? (
            <PageDashboard role="admin"/>
        ) : /*status === "authenticated"?  <p>autentificado</p>:*/(
          <PageDashboard role= "cliente"/>
          /*<>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
          </>
            //<LoginPage/>*/
         );
    } else {
      return (
        /*<section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
              <div className="mx-auto max-w-screen-sm text-center">
                  <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary2-600 dark:text-primary2-500">404</h1>
                  <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Sesión no encontrada.</p>
                  <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Algo salió mal. Redirijase al ingreso para entrar al portal.</p>
                  <button onClick={()=>{signIn("keycloak", {callbackUrl:"/"})}} className="inline-flex text-white bg-primary2-600 hover:bg-primary2-800 focus:ring-4 focus:outline-none focus:ring-primary2-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary2-900 my-4">Ingresar</button>
              </div>   
          </div>
        </section>*/
        <LoginPage/> 
       //<PageDashboard role="admin"/>
          
      );
    }
}


function setEmpresas(company: any) {
  throw new Error("Function not implemented.");
}
  