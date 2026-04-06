import { prisma } from '@repo/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '../../../../lib/auth';

export async function GET() {
    const user = await getServerSession();
    if (!user) {
        return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, email, currentPassword, newPassword } = body;

        const user = await prisma.user.findUnique({ where: { id: session.id } });
        if (!user) {
            return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
        }

        const updateData: { name?: string; email?: string; password?: string } = {};

        if (name && name !== user.name) {
            updateData.name = name;
        }

        if (email && email !== user.email) {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                return NextResponse.json({ error: 'Dit e-mailadres is al in gebruik' }, { status: 409 });
            }
            updateData.email = email;
        }

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Huidig wachtwoord is verplicht' }, { status: 400 });
            }
            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) {
                return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 401 });
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ error: 'Nieuw wachtwoord moet minimaal 8 tekens bevatten' }, { status: 400 });
            }
            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        const updated = await prisma.user.update({
            where: { id: session.id },
            data: updateData,
        });

        return NextResponse.json({
            user: { id: updated.id, email: updated.email, name: updated.name },
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Bijwerken mislukt' }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    try {
        await prisma.user.delete({ where: { id: session.id } });

        const cookieStore = await cookies();
        const token = cookieStore.get('twelo_session')?.value;

        const response = NextResponse.json({ success: true });
        response.cookies.set('twelo_session', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Account verwijderen mislukt' }, { status: 500 });
    }
}
