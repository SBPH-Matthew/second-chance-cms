"use client";
import { EditUserPageRouter } from "@/app/features/iam/user-ui/router";

export default function EditUserPage({ params }: { params: { id: string } }) {
  return <EditUserPageRouter userId={parseInt(params.id)} />;
}
