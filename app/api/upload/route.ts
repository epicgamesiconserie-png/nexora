import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body!, {
      access: 'public',
      addRandomSuffix: true,  // 👈 This is the fix
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error('=== BLOB UPLOAD ERROR ===');
    console.error(error);
    console.error('=========================');
    return NextResponse.json(
      { error: 'Upload failed', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}