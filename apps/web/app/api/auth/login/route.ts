import { prisma } from '@repo/prisma';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'E-mail en wachtwoord zijn verplicht' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Onjuist e-mailadres of wachtwoord' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json({ error: 'Onjuist e-mailadres of wachtwoord' }, { status: 401 });
        }

        const token = nanoid(48);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.session.create({
            data: { userId: user.id, token, expiresAt },
        });

        const response = NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name },
        });

        response.cookies.set('twelo_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Inloggen mislukt' }, { status: 500 });
    }
}
