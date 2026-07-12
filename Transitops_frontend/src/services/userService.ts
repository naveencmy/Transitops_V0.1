import { api } from "./api";

export interface ManagedUser {

  id: number;

  email: string;

  full_name: string;

  phone: string;

  role: string;

  status: string;

  created_at: string;

}

export interface UpdateUserRoleDto {

  role: string;

}

export interface UpdateUserDto {

  full_name?: string;

  phone?: string;

  role?: string;

  status?: string;

}

class UserService {

  async getUsers() {

    return api.get<ManagedUser[]>(
      "/users"
    );

  }

  async getUserById(id:number|string){

    return api.get<ManagedUser>(
      `/users/${id}`
    );

  }

  async updateUser(

    id:number|string,

    data:UpdateUserDto

  ){

    return api.put<ManagedUser>(

      `/users/${id}`,

      data

    );

  }

  async updateRole(

    id:number|string,

    role:string

  ){

    return api.put<ManagedUser>(

      `/users/${id}/role`,

      {role}

    );

  }

  async deleteUser(

    id:number|string

  ){

    return api.delete<void>(

      `/users/${id}`

    );

  }

}

export const userService =
new UserService();