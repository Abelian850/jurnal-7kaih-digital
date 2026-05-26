import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarLayout } from "@/components/layout/sidebar-layout";

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if ((session.user as { role: string }).role !== "guru_wali") redirect("/admin/dashboard");

  return (
    <SidebarLayout role="guru_wali" userName={session.user.name ?? "Guru"}>
      {children}
    </SidebarLayout>
  );
}
