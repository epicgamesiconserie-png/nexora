import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { urlMatchesPlatform, platformLabel } from '@/lib/socialPlatforms';

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

  // === One per platform check ===
  const alreadyHave = await prisma.social.findFirst({
    where: { userId: session.userId, platform },
    select: { id: true },
  });
  if (alreadyHave) {
    return NextResponse.json(
      { error: `You already have a ${platformLabel(platform)} link. Delete it first to add a new one.` },
      { status: 409 }
    );
  }

  // === URL / platform match check ===
  if (!urlMatchesPlatform(platform, url)) {
    return NextResponse.json(
      {
        error: `That doesn't look like a valid ${platformLabel(platform)} link. Please paste a proper ${platformLabel(platform)} URL.`,
      },
      { status: 400 }
    );
  }

  // Count existing to set position
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

// PATCH — update an existing social (e.g., change its URL)
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

  // Verify ownership
  const existing = await prisma.social.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // === URL / platform match check (on edit too) ===
  if (!urlMatchesPlatform(existing.platform, url)) {
    return NextResponse.json(
      {
        error: `That doesn't look like a valid ${platformLabel(existing.platform)} link. Please paste a proper ${platformLabel(existing.platform)} URL.`,
      },
      { status: 400 }
    );
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

  // Verify ownership
  const social = await prisma.social.findUnique({ where: { id } });
  if (!social || social.userId !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.social.delete({ where: { id } });

  return NextResponse.json({ success: true });
}