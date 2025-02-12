import React from "react";
import PageDashboard from "../dashboard/page";
import PageLogin from "../login/page";
import axios from "axios";
import { useEffect, useState } from "react";
//import { useSidebarContext } from "@/app/context/SidebarContext";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AppPage() {
    //const [sessionStatus, setSessionStatus] = useState(0); // Estado para almacenar el estado de la sesión
    //const {session} = useSidebarContext();
    const { status, data: session } = useSession();
    
    /*const sesion = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4108/login/verifyToken",
          {}, // Cuerpo vacío
          {
            withCredentials: true, // Habilita el envío de cookies
          }
        );
        //console.log(response);
        setSessionStatus(response.status); // Actualiza el estado con el código de respuesta
      } catch (error) {
        console.log("Error al verificar la sesión");
        console.log(error);
        setSessionStatus(0); // Si hay un error, establece el estado en 0
      }
    };
  
    useEffect(() => {
      //TO DO: Arreglar sesion, de momento esta hardcodeado
      //sesion(); // Llama a la función sesion cuando el componente se monta
      setSessionStatus(200)
    }, []);*/

    if (status === "loading") {
      return <div>Loading...</div>;
      
    }else if(session){
    
     return /*sessionStatus === 200  session === "admin" ?*/ session.user.role === "admin" ? (
        <PageDashboard/>
    ):( <PageLogin/>);
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

  