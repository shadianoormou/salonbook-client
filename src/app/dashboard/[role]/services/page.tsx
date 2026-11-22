import { Protected } from '@/components/protected';
import { ServicesManager } from '@/components/services-manager';
export default function Services() {
  return (
    <Protected role="admin">
      <ServicesManager />
    </Protected>
  );
}
