import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarLayout } from "@/components/layout/sidebar-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/login");
  if ((session.user as { role: string }).role !== "admin") redirect("/guru/dashboard");

  return (
    <SidebarLayout role="admin" userName={session.user.name ?? "Admin"}>
      {children}
    </SidebarLayout>
  );
}
