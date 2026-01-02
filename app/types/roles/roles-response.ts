import { ResponseType } from "../ResponseType";

export interface RolesResponse extends ResponseType {
  roles: {
    total: number;
    items: Array<Role>;
  };
}

export interface Role {
  id: string;
  name: string;
}
