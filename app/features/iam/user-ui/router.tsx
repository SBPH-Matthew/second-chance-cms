"use client";

import { CreateUserV1 } from "@/app/features/iam/user-ui/variants/v1/CreateUserV1";
import { EditUserV1 } from "@/app/features/iam/user-ui/variants/v1/EditUserV1";

export function CreateUserPageRouter() {
  return <CreateUserV1 />;
}

export function EditUserPageRouter({ userId }: { userId: number }) {
  return <EditUserV1 userId={userId} />;
}
