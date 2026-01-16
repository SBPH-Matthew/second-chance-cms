import { ResponseType } from "../ResponseType";
import { Role } from "../shared";

// Re-export Role for convenience
export type { Role };

// Response types
export interface RolesResponse extends ResponseType {
  roles: {
    total: number;
    items: Role[];
  };
}
