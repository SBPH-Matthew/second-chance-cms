import { ResponseType } from "../ResponseType";

// Backend model types (snake_case from JSON tags)
export interface Notification {
  id: number;
  user_id?: number | null; // If set, personal notification for this user; if null, system-wide notification for all users
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean; // This is added by the backend handler based on NotificationRead table (per-user read status tracking)
  reference?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Response types
export interface GetNotificationsResponse extends ResponseType {
  notifications: Notification[];
  unread_count: number;
}
