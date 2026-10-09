import { NextRequest, NextResponse } from 'next/server';
import { vehicleIdParamSchema } from '@/lib/validations/rankingsSchema';
import { RankingsService } from '@/lib/services/rankingsService';
import { ZodError } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const rawParams = await Promise.resolve(context.params);
    const { id } = vehicleIdParamSchema.parse(rawParams);

    const vehicleDetail = await RankingsService.getVehicleById(id);

    if (!vehicleDetail) {
      return NextResponse.json(
        { error: 'Vehicle not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicleDetail, { status: 200 });
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

    console.error('API /api/rankings/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
