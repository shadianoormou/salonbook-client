import { Protected } from '@/components/protected';
import { ServiceForm } from '@/components/service-form';
export default function NewService() {
  return (
    <Protected role="admin">
      <ServiceForm />
    </Protected>
  );
}
