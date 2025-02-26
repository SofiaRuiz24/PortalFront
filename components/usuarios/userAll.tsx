import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, X } from "lucide-react";
import axios from "axios";
import { useSidebarContext } from "@/app/context/SidebarContext";
import Empresa from "@/app/types/empresasTypes";

interface User {
  _id: string;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  empresas: Empresa[];
}

export function UserAll() {
  const { toast } = useToast();
  const { empresas } = useSidebarContext();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form states
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [empresa, setEmpresa] = useState<Empresa[]>([]);
  const [empresasSeleccionadas, setEmpresasSeleccionadas] = useState<Empresa[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://t72m2pk3-4108.brs.devtunnels.ms/usuarios");
      setUsers(response.data.data);
      console.log("Usuarios", response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEmpresaChange = (value: string) => {
    const selectedEmpresa = empresas?.find((e) => e.nombre === value);
    if (selectedEmpresa && !empresasSeleccionadas.some((e) => e._id === selectedEmpresa._id)) {
      setEmpresasSeleccionadas([...empresasSeleccionadas, selectedEmpresa]);
    }
  };

  const handleRemoveEmpresa = (empresaId: string) => {
    setEmpresasSeleccionadas(empresasSeleccionadas.filter((e) => e._id !== empresaId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const userData = {
      nombre,
      email,
      password,
      rol,
      empresas: empresasSeleccionadas
    };

    try {
      if (editingUser) {
        await axios.put(`https://t72m2pk3-4108.brs.devtunnels.ms/usuarios/${editingUser._id}`, userData);
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
          variant: "default",
        });
      } else {
        await axios.post("https://t72m2pk3-4108.brs.devtunnels.ms/usuarios", userData);
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
          variant: "default",
        });
      }
      
      formRef.current?.reset();
      clearForm();
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNombre(user.nombre);
    setEmail(user.email);
    setPassword(user.password);
    setRol(user.rol);
    const newEmpresa: Empresa[] = user.empresas;
    setEmpresa(newEmpresa);
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`https://t72m2pk3-4108.brs.devtunnels.ms/usuarios/${userId}`);
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
        variant: "default",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("");
    setEmpresa([{ _id: "", nombre: "",icon : "BookOpen"}]);
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8 p-2 sm:p-4 lg:p-8">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            {editingUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required={!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={rol} onValueChange={setRol}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="empresas">Empresa</Label>
                <Select onValueChange={handleEmpresaChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas?.map((empresa) => (
                      <SelectItem key={empresa._id} value={empresa.nombre}>
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/*<div className="space-y-2 sm:col-span-2">
                <Label>Empresas Seleccionadas</Label>
                <div className="min-h-[60px] p-2 rounded-md border border-input bg-background">
                  {empresasSeleccionadas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">No hay empresas seleccionadas</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {empresasSeleccionadas?.map((empresa) => (
                        <div
                          key={empresa._id}
                          className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{empresa.nombre}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => handleRemoveEmpresa(empresa._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>*/}
            </div>
            <div className="flex justify-end gap-4 pt-2">
              {editingUser && (
                <Button type="button" variant="outline" onClick={clearForm}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">
                {editingUser ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Usuarios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Vista móvil */}
          <div className="block sm:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-secondary/10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{user.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Rol: </span>
                    <span className="capitalize">{user.rol}</span>
                  </div>
                  <div>
                    <span className="font-medium">Empresas: </span>
                    <span>{user.empresas?.map((empresa) => empresa.nombre).join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.rol}</TableCell>
                    <TableCell>{user.empresas?.map((empresa) => empresa.nombre).join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}