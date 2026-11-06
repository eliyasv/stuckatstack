import { NextResponse } from 'next/server';

// A live process must handle this request; do not serve a cached build artifact.
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
