import { Protected } from '@/components/protected';
import { UsersManager } from '@/components/users-manager';
export default function Customers() {
  return (
    <Protected role="admin">
      <UsersManager />
    </Protected>
  );
}
