// Legacy placeholder to avoid 404 if someone hits /api/auth/*
// NextAuth has been removed; return 410 Gone for both GET and POST.
import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({ error: 'Auth removed' }, { status: 410 });
}

export async function POST() {
	return NextResponse.json({ error: 'Auth removed' }, { status: 410 });
}
