import { AppointmentDetail } from '@/components/appointment-detail';
export default async function Appointment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppointmentDetail id={id} />;
}
