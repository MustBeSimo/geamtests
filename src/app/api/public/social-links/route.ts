import { NextResponse } from 'next/server';
import { getSocialLinks } from '@/utils/socialLinks';

export const revalidate = 3600; // cache at the route level for 1 hour

export async function GET() {
  try {
    const links = getSocialLinks();
    return new NextResponse(
      JSON.stringify({ links }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Browser and CDN cache for 1h, allow stale while revalidate
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  } catch (error) {
    console.error('Error in social links API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    );
  }
} 