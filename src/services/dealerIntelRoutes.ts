import { Router, Request, Response } from 'express';
import { DealerIntelService } from './dealerIntelService';
import { ZodError } from 'zod';

export const dealerIntelRouter = Router();

// Helper to extract authenticated user ID from Bearer token or simulated header
function getAuthUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In production with Supabase Auth, decode JWT or pass through
    return req.headers['x-user-id'] as string || authHeader.slice(7);
  }
  return (req.headers['x-user-id'] as string) || null;
}

// Global error wrapper for Zod and Service errors
function handleRouteError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    });
  }
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('Unauthorized') || message.includes('Authentication required')) {
    return res.status(401).json({ error: message });
  }
  if (message.includes('not found')) {
    return res.status(404).json({ error: message });
  }
  if (message.includes('Duplicate review')) {
    return res.status(409).json({ error: message });
  }
  return res.status(500).json({ error: 'Internal Server Error', details: message });
}

/**
 * GET /dealers
 * Search dealerships with filters (query, brand, city, rating, transparency, pagination)
 */
dealerIntelRouter.get('/dealers', async (req: Request, res: Response) => {
  try {
    const results = await DealerIntelService.searchDealerships(req.query as any);
    res.json(results);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /dealers/brands
 * Get list of all available automotive brands for filters
 */
dealerIntelRouter.get('/dealers/brands', async (_req: Request, res: Response) => {
  try {
    const brands = await DealerIntelService.getAvailableBrands();
    res.json({ brands });
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /dealers/by-slug/:slug
 * Retrieve single dealership by SEO-friendly slug
 */
dealerIntelRouter.get('/dealers/by-slug/:slug', async (req: Request, res: Response) => {
  try {
    const dealer = await DealerIntelService.getDealershipBySlug(req.params.slug);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealership not found' });
    }
    res.json(dealer);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /dealers/:id
 * Retrieve single dealership by ID
 */
dealerIntelRouter.get('/dealers/:id', async (req: Request, res: Response) => {
  try {
    const dealer = await DealerIntelService.getDealershipById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealership not found' });
    }
    res.json(dealer);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /dealers/:id/reviews
 * Get paginated published reviews for a dealership
 */
dealerIntelRouter.get('/dealers/:id/reviews', async (req: Request, res: Response) => {
  try {
    const queryParams = {
      dealershipId: req.params.id,
      ...req.query
    };
    const reviews = await DealerIntelService.getReviews(queryParams as any);
    res.json(reviews);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /reviews
 * Submit a consumer review (enforces duplicate prevention & Zod validation)
 */
dealerIntelRouter.post('/reviews', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const review = await DealerIntelService.createReview(userId, req.body);
    res.status(201).json(review);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /reviews/:id/helpful
 * Vote helpful on a consumer review
 */
dealerIntelRouter.post('/reviews/:id/helpful', async (req: Request, res: Response) => {
  try {
    const helpfulCount = await DealerIntelService.markReviewHelpful(req.params.id);
    res.json({ success: true, helpfulCount });
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /reviews/:id/report
 * Flag a review for moderation
 */
dealerIntelRouter.post('/reviews/:id/report', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const report = await DealerIntelService.reportReview(userId, {
      review_id: req.params.id,
      ...req.body
    });
    res.status(201).json(report);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /reviews/:id/evidence
 * Record private evidence pointer (vault upload)
 */
dealerIntelRouter.post('/reviews/:id/evidence', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to upload evidence' });
    }
    const evidence = await DealerIntelService.registerReviewEvidence(userId, {
      review_id: req.params.id,
      ...req.body
    });
    res.status(201).json(evidence);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /dealers/:id/claim
 * Submit ownership claim for a dealership
 */
dealerIntelRouter.post('/dealers/:id/claim', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to claim a dealership' });
    }
    const claim = await DealerIntelService.submitDealerClaim(userId, {
      dealership_id: req.params.id,
      ...req.body
    });
    res.status(201).json(claim);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * POST /reviews/:id/response
 * Official verified dealership response to a review
 */
dealerIntelRouter.post('/reviews/:id/response', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to post an official response' });
    }
    const response = await DealerIntelService.submitDealerResponse(userId, {
      review_id: req.params.id,
      ...req.body
    });
    res.status(201).json(response);
  } catch (err) {
    handleRouteError(res, err);
  }
});

/**
 * GET /tags
 * List standardized issue and praise tags
 */
dealerIntelRouter.get('/tags', async (_req: Request, res: Response) => {
  try {
    const tags = await DealerIntelService.getTags();
    res.json({ tags });
  } catch (err) {
    handleRouteError(res, err);
  }
});
