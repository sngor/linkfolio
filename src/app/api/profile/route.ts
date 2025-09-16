import { NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/store';
import { profile as defaultProfile } from '@/lib/profile';
import { verifyRequestIdToken } from '@/lib/authServer';

export async function GET() {
  return NextResponse.json(defaultProfile);
}

export async function POST(req: Request) {
  const user = await verifyRequestIdToken(req);
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = user.email;
  const existing = await getProfile(id);
  if (!existing) {
    await saveProfile(id, defaultProfile);
  }
  const prof = (await getProfile(id)) ?? defaultProfile;
  return NextResponse.json(prof);
}

export async function PUT(req: Request) {
  const user = await verifyRequestIdToken(req);
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = user.email;
  const data = await req.json();
  await saveProfile(id, data);
  return NextResponse.json({ ok: true });
}
