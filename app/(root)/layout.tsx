import { ReactNode } from 'react'
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from '@/lib/actions/auth.action';
import LogoutButton from '@/components/LogoutButton';
import { Toaster } from '@/components/ui/sonner';

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const user = await getCurrentUser();
    return (
        <div className="root-layout">
            <nav className="flex items-center gap-4 py-4 px-6 border-b border-border">
                <Link href="/"  className="flex items-center gap-2" >
                    <Image src="/logo.svg" alt="Logo" width={38} height={32} />
                    <h2 className="text-primary-100 font-semibold text-lg">PrepWise</h2>
                </Link>
                <div className="flex-1" />
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.name}</span>
                        <LogoutButton />
                    </div>
                )}
            </nav>

            <main className="px-6 py-6">{children}</main>
            {/* Global toaster */}
            <Toaster richColors closeButton position="top-right" />
        </div>
    )
}
export default RootLayout