"use client"
import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image";
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background2">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-sidebar-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-sidebar-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Sasha
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs text-sidebar-foreground flex flex-col items-center gap-8 text-center">
            {/*<LoginForm />*/}
            <Image className="mb-6 ml-[-15px]" src="/images/logo---ortubia.png" alt="Logo" width={200} height={200} />
            
            <Button onClick={()=>{signIn("keycloak", {callbackUrl:"/"})}} className="w-2/3 bg-orange-700 hover:bg-orange-800">
               Ingresar
            </Button>
            <div className="text-center text-sm">
              ¿No tiene cuenta?{" "}
              <a href="#" className="hover:underline underline-offset-4 hover:text-orange-600">
               Solicitar registro
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
