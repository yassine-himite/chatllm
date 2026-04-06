import { prisma } from '@repo/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '../../../lib/auth';

export async function POST(request: NextRequest) {
    const session = await getServerSession();
    const userId = session?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedback } = await request.json();

    await prisma.feedback.create({
        data: {
            userId,
            feedback,
            metadata: {},
        },
    });

    return NextResponse.json({ message: 'Feedback received' }, { status: 200 });
}
