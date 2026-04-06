import { prisma } from '@repo/prisma';
import { cookies } from 'next/headers';

export type AuthUser = {
    id: string;
    email: string;
    name: string;
};

export async function getServerSession(): Promise<AuthUser | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('twelo_session')?.value;
        if (!token) return null;

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session) return null;
        if (session.expiresAt < new Date()) {
            await prisma.session.delete({ where: { token } });
            return null;
        }

        return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
        };
    } catch {
        return null;
    }
}
