import { z } from 'zod';

export const vehicleBodyTypes = [
  'sedan',
  'suv',
  'truck',
  'hatchback',
  'wagon',
  'coupe',
  'minivan',
  'hybrid_ev'
] as const;

export const valuationChannels = ['private_party', 'dealer_retail'] as const;

export const rankingTiers = [
  'sub-6k',
  '6k-11k',
  '11k-18k',
  '18k-26k',
  '26k-plus'
] as const;

export const rankingSortOptions = [
  'score_desc',
  'reliability_desc',
  'ownership_cost_asc',
  'spread_desc'
] as const;

/**
 * Zod schema for GET /api/rankings query parameters
 */
export const rankingsQuerySchema = z.object({
  channel: z.enum(valuationChannels).default('private_party'),
  min_price: z.coerce.number().nonnegative().optional(),
  max_price: z.coerce.number().positive().optional(),
  tier: z.enum(rankingTiers).optional(),
  body_type: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === 'all') return undefined;
      const parts = val.split(',').map((p) => p.trim().toLowerCase());
      const valid = parts.filter((p): p is (typeof vehicleBodyTypes)[number] =>
        (vehicleBodyTypes as readonly string[]).includes(p)
      );
      return valid.length > 0 ? valid : undefined;
    }),
  sort_by: z.enum(rankingSortOptions).default('score_desc'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type RankingsQueryParams = z.infer<typeof rankingsQuerySchema>;

/**
 * Zod schema for single vehicle ID param
 */
export const vehicleIdParamSchema = z.object({
  id: z.string().min(1, 'Vehicle ID is required'),
});

export type VehicleIdParam = z.infer<typeof vehicleIdParamSchema>;
