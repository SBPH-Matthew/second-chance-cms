import { ResponseType } from "../ResponseType";
import { User } from "../shared";

// Re-export User for convenience
export type { User };

// Response types
export interface PaginateUsersResponse extends ResponseType {
  users: {
    total: number;
    items: User[];
  };
}
