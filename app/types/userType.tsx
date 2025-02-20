import Empresa from "./empresasTypes";

interface User {
    email: string;
    role: string;
    name: string;
    empresas: Empresa[];
}

export default User;