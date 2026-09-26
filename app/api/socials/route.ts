import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET — list current user's socials
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const socials = await prisma.social.findMany({
    where: { userId: session.userId },
    orderBy: { position: 'asc' },
  });

  return NextResponse.json({ socials });
}

// POST — add a new social
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const body = await request.json();
  const { platform, url } = body;

  if (!platform || !url) {
    return NextResponse.json(
      { error: 'Missing platform or url' },
      { status: 400 }
    );
  }

  const count = await prisma.social.count({
    where: { userId: session.userId },
  });

  const social = await prisma.social.create({
    data: {
      userId: session.userId,
      platform,
      url,
      position: count,
    },
  });

  return NextResponse.json({ social });
}

// PATCH — update an existing social
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const body = await request.json();
  const { id, url } = body;

  if (!id || !url) {
    return NextResponse.json(
      { error: 'Missing id or url' },
      { status: 400 }
    );
  }

  const existing = await prisma.social.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const social = await prisma.social.update({
    where: { id },
    data: { url },
  });

  return NextResponse.json({ social });
}

// DELETE — remove a social by id
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const social = await prisma.social.findUnique({ where: { id } });
  if (!social || social.userId !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.social.delete({ where: { id } });

  return NextResponse.json({ success: true });
}