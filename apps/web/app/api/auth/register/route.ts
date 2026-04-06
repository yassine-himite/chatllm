import { prisma } from '@repo/prisma';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Naam, e-mail en wachtwoord zijn verplicht' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Wachtwoord moet minimaal 8 tekens bevatten' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Dit e-mailadres is al in gebruik' }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

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
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Registratie mislukt' }, { status: 500 });
    }
}
