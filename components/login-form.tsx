import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import axios from "axios";
import { useSidebarContext } from "@/app/context/SidebarContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {session , setSession} = useSidebarContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password.match("admin1234")){
      console.log("bandera login");
      setSession("admin");
    }
    console.log('Email:', email);
    console.log('Password:', password);
    console.log(session);
    /*try {
      const response = await axios.post(
        "http://localhost:4108/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Redirigir al dashboard
        window.location.replace("/");
      } else {
        setError(response.data || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
    }*/
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Ingresa tu cuenta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingrese el correo electrónico asociado a su cuenta.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="usuario@ejemplo.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidó su contraseña?
            </a>
          </div>
          <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿No tiene cuenta?{" "}
        <a href="#" className="underline underline-offset-4">
          Solicitar registro
        </a>
      </div>
    </form>
  )
}
