"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOut } from '@/lib/actions/auth.action';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut();
        toast.success('Logged out successfully');
        router.push('/sign-in');
      } catch (e) {
        console.error('Logout failed', e);
        toast.error('Logout failed');
        router.refresh();
      }
    });
  };

  return (
    <Button variant="outline" className="ml-auto" onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
