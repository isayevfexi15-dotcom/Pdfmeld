import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

export function GET() {
  const adsText = 'google.com, pub-9374245691910556, DIRECT, f08c47fec0942fa0';
  
  return new NextResponse(adsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
