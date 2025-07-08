import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const pastSearches = await prisma.search.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        searchTime: 'desc'
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        query: true,
        country: true,
        resultsCount: true,
        searchTime: true
      }
    });

    return NextResponse.json({
      searches: pastSearches,
      total: await prisma.search.count({
        where: { userId: session.user.id }
      })
    });

  } catch (error) {
    console.error('Past searches API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}