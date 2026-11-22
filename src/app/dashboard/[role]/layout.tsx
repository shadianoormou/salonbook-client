import { notFound } from 'next/navigation';
import { Protected } from '@/components/protected';
import { DashboardShell } from '@/components/dashboard-shell';
export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (role !== 'customer' && role !== 'admin') notFound();
  return (
    <Protected role={role}>
      <DashboardShell role={role}>{children}</DashboardShell>
    </Protected>
  );
}
