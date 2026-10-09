import { NextRequest, NextResponse } from 'next/server';
import { valuationChannels } from '@/lib/validations/rankingsSchema';
import { RankingsService, ValuationChannel } from '@/lib/services/rankingsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelParam = searchParams.get('channel') || 'private_party';

    const channel: ValuationChannel = (valuationChannels as readonly string[]).includes(channelParam)
      ? (channelParam as ValuationChannel)
      : 'private_party';

    const summaries = await RankingsService.getTiersSummary(channel);

    return NextResponse.json(
      {
        channel,
        tiers: summaries,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('API /api/rankings/tiers-summary error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
