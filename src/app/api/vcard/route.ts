import { NextResponse } from 'next/server';
import { profile as defaultProfile } from '@/lib/profile';
import { generateVCard } from '@/lib/vcard';
import { getProfile } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const prof = idParam ? (await getProfile(idParam)) ?? defaultProfile : defaultProfile;
  const vcf = generateVCard(prof);
  return new NextResponse(vcf, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="contact.vcf"'
    }
  });
}
