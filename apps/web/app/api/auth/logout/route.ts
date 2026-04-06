import { prisma } from '@repo/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('twelo_session')?.value;

        if (token) {
            await prisma.session.deleteMany({ where: { token } });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set('twelo_session', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Uitloggen mislukt' }, { status: 500 });
    }
}
