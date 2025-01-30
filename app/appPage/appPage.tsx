import React from "react";
import PageDashboard from "../dashboard/page";
import PageLogin from "../login/page";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSidebarContext } from "@/app/context/SidebarContext";

export default function AppPage() {
    const [sessionStatus, setSessionStatus] = useState(0); // Estado para almacenar el estado de la sesión
    const {session} = useSidebarContext();
  
    const sesion = async () => {
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
    }, []);
  
    return /*sessionStatus === 200 */ session === "admin" ? (
        <PageDashboard/>
    ):( <PageLogin/>);
}
  