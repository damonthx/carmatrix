import { NextRequest, NextResponse } from 'next/server';
import { rankingsQuerySchema } from '@/lib/validations/rankingsSchema';
import { RankingsService } from '@/lib/services/rankingsService';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const parsedQuery = rankingsQuerySchema.parse(queryObj);
    const result = await RankingsService.getRankings(parsedQuery);

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      );
    }

    console.error('API /api/rankings error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
