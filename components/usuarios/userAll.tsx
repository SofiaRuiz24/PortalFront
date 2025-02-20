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
import { Pencil, Trash2 } from "lucide-react";
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
      const response = await axios.get("http://localhost:4108/usuarios");
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
        await axios.put(`http://localhost:4108/usuarios/${editingUser._id}`, userData);
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
          variant: "default",
        });
      } else {
        await axios.post("http://localhost:4108/usuarios", userData);
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
      await axios.delete(`http://localhost:4108/usuarios/${userId}`);
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
    setEmpresa([{ _id: "", nombre: "" }]);
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col gap-8 m-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
              </div>
              <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
              </div>
              <div className="space-y-2">
          <Label htmlFor="usuario">Usuario</Label>
          <Input
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
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
            required={!editingUser}
          />
              </div>
              <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <Select value={rol} onValueChange={setRol}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
              </div>
                <div className="space-y-2">
                <Label htmlFor="empresas">Empresa</Label>
                <Select onValueChange={handleEmpresaChange}>
              <SelectTrigger>
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
                <div className="space-y-2">
              <Label>Empresas Seleccionadas</Label>
              <div className="flex flex-wrap gap-2">
              {empresasSeleccionadas.length === 0 && <p className="ml-2 text-gray-500 text-sm">No hay empresas seleccionadas</p>}
              {empresasSeleccionadas?.map((empresa) => (
                <div key={empresa._id} className="flex items-center gap-2 bg-gray-200 p-2 rounded">
                <span>{empresa.nombre}</span>
                <Button variant="destructive" className="h-[20px] w-[10px]" onClick={() => handleRemoveEmpresa(empresa._id)}>
                  X
                </Button>
                </div>
              ))}
              </div>
                </div>
            </div>
            <div className="flex justify-end gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Usuarios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{user.rol}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}