import { NextResponse } from 'next/server';

export async function POST() {
  if (process.env.NODE_ENV === 'production') return new NextResponse('Not found', { status: 404 });
  return NextResponse.json({ success: true });
}
