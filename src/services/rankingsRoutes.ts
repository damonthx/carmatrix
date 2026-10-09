import { Router, Request, Response } from 'express';
import { rankingsQuerySchema, vehicleIdParamSchema, valuationChannels } from '../../lib/validations/rankingsSchema';
import { RankingsService, ValuationChannel } from '../../lib/services/rankingsService';
import { ZodError } from 'zod';

export const rankingsRouter = Router();

function handleRouteError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('not found')) {
    return res.status(404).json({ error: message });
  }
  return res.status(500).json({ error: 'Internal Server Error', details: message });
}

/**
 * GET /api/rankings
 * Query top-rated vehicles dynamically with channel, price, body type, and sorting options
 */
rankingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const parsedQuery = rankingsQuerySchema.parse(req.query);
    const result = await RankingsService.getRankings(parsedQuery);
    res.json(result);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /api/rankings/tiers-summary
 * Pre-computed summary of each price tier for fast header tabs
 */
rankingsRouter.get('/tiers-summary', async (req: Request, res: Response) => {
  try {
    const channelParam = (req.query.channel as string) || 'private_party';
    const channel: ValuationChannel = (valuationChannels as readonly string[]).includes(channelParam)
      ? (channelParam as ValuationChannel)
      : 'private_party';

    const summaries = await RankingsService.getTiersSummary(channel);
    res.json({ channel, tiers: summaries });
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /api/rankings/:id
 * Single vehicle detailed breakdown
 */
rankingsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = vehicleIdParamSchema.parse(req.params);
    const detail = await RankingsService.getVehicleById(id);

    if (!detail) {
      return res.status(404).json({ error: 'Vehicle not found', id });
    }

    res.json(detail);
  } catch (err) {
    handleRouteError(res, err);
  }
});
