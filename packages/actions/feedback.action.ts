'use server';

import { cookies } from 'next/headers';
import { prisma } from '@repo/prisma';

export const submitFeedback = async (feedback: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('twelo_session')?.value;
        if (!token) return { error: 'Unauthorized' };

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return { error: 'Unauthorized' };
        }

        return feedback;
    } catch {
        return { error: 'Unauthorized' };
    }
};
