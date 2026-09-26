import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const body = await request.json();
    const { backgroundUrl, backgroundType } = body;

    if (!backgroundUrl) {
      return NextResponse.json({ error: 'Missing backgroundUrl' }, { status: 400 });
    }

    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: {
        backgroundUrl,
        backgroundType: backgroundType || 'image',
      },
      create: {
        userId: session.userId,
        backgroundUrl,
        backgroundType: backgroundType || 'image',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update background error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}