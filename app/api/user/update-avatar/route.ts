import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { avatarUrl } = await request.json();
  if (!avatarUrl) {
    return NextResponse.json({ error: 'Missing avatarUrl' }, { status: 400 });
  }

  await prisma.profile.upsert({
    where: { userId: session.userId },
    update: { avatarUrl },
    create: { userId: session.userId, avatarUrl },
  });

  return NextResponse.json({ success: true });
}