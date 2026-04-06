import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ error: 'Registratie is uitgeschakeld' }, { status: 403 });
}
