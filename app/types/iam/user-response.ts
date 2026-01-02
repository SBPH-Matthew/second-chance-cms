import { ResponseType } from "../ResponseType";

export interface UsersItems {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface PaginateUsersResponse extends ResponseType {
  users: {
    total: number;
    items: Array<UsersItems>;
  };
}
