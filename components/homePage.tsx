import { useSidebarContext } from "@/app/context/SidebarContext";
import { useSidebarContext } from "@/app/context/SidebarContext";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Rocket, 
  Target, 
  Users, 
  Shield, 
  Award, 
  Globe,
  CheckCircle2,
  Lightbulb,
  HandshakeIcon,
} from "lucide-react";

export function HomePage() {
  const { selectedEmpresa } = useSidebarContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-accent p-8 mb-12">
          <div className="relative z-10">
            <Badge variant="outline" className="mb-4 bg-white/10 backdrop-blur-sm border-none text-white">
              Bienvenidos
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              {selectedEmpresa}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Innovación y excelencia en servicios petroleros. Comprometidos con el futuro energético.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
            <Globe className="w-full h-full" />
          </div>
        </div>

        {/* Valores Corporativos Grid 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Misión</h3>
              </div>
              <p className="text-gray-600">
                Proporcionar servicios y soluciones integrales de alta calidad para la industria petrolera, 
                garantizando la excelencia operativa y el desarrollo sostenible.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Visión</h3>
              </div>
              <p className="text-gray-600">
                Ser una empresa líder y modelo en servicios petroleros, reconocida por su compromiso con la calidad,
                la innovación y la satisfacción de sus clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Valores</h3>
              </div>
              <p className="text-gray-600">
                Integridad, excelencia, innovación y compromiso son los pilares fundamentales 
                que guían nuestras operaciones y relaciones comerciales.
              </p>
            </CardContent>
          </Card>
        </div>*/}

        {/* Características Destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
              title: "Calidad Garantizada",
              description: "Estándares de excelencia en cada servicio"
            },
            {
              icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
              title: "Innovación Constante",
              description: "Tecnología de vanguardia en nuestras soluciones"
            },
            {
              icon: <Users className="h-8 w-8 text-blue-500" />,
              title: "Equipo Experto",
              description: "Profesionales altamente calificados"
            },
            {
              icon: <Award className="h-8 w-8 text-purple-500" />,
              title: "Certificaciones",
              description: "Cumplimiento de estándares internacionales"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}