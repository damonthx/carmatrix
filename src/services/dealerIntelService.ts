import { supabase } from '../supabaseClient';
import {
  Dealership,
  Review,
  Tag,
  ReviewEvidence,
  ReviewReport,
  DealerClaim,
  DealerResponse,
  AdminAuditLog,
  PaginatedResult
} from '../types/dealerIntel';
import {
  DealerSearchSchema,
  DealerSearchParamsInput,
  CreateReviewSchema,
  CreateReviewInput,
  ReviewSearchSchema,
  ReviewSearchParamsInput,
  CreateClaimSchema,
  CreateClaimInput,
  CreateResponseSchema,
  CreateResponseInput,
  CreateReportSchema,
  CreateReportInput,
  CreateEvidenceSchema,
  CreateEvidenceInput,
  ModerateReviewSchema,
  ModerateReviewInput,
  ModerateClaimSchema,
  ModerateClaimInput
} from './dealerIntelValidation';
import { DFW_DEALERSHIPS_SEED, seedToDealership } from './dfwDealerSeedData';

/**
 * Standardized Seed Tags constant for fast lookups and offline fallback
 */
export const STANDARD_SEED_TAGS: Tag[] = [
  { id: 'tag-1', slug: 'unexpected-fees', label: 'Unexpected Fees', category: 'issue', severity: 'critical', description: 'Dealer attempted to introduce unannounced fees at time of signing.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-2', slug: 'forced-addons', label: 'Forced Add-ons', category: 'issue', severity: 'critical', description: 'Mandatory protection packages, tint, nitrogen, or coatings added above asking price.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-3', slug: 'advertised-price-discrepancy', label: 'Advertised Price Discrepancy', category: 'issue', severity: 'warning', description: 'Actual showroom vehicle price did not match the online advertised price.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-4', slug: 'financing-terms-changed', label: 'Financing Terms Changed', category: 'issue', severity: 'critical', description: 'Financing rates, terms, or monthly payments were altered between sales and F&I.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-5', slug: 'high-pressure-sales', label: 'High-Pressure Sales', category: 'issue', severity: 'warning', description: 'Aggressive or coercive sales tactics used during negotiation.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-6', slug: 'trade-in-concerns', label: 'Trade-in Concerns', category: 'issue', severity: 'warning', description: 'Trade-in allowance reduced or undervalued without mechanical basis.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-7', slug: 'misleading-vehicle-availability', label: 'Misleading Vehicle Availability', category: 'issue', severity: 'warning', description: 'Advertised car was not in stock or was already sold before arrival.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-8', slug: 'clear-pricing', label: 'Clear Pricing', category: 'praise', severity: 'positive', description: 'Upfront, transparent pricing with zero surprise charges.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-9', slug: 'no-pressure-experience', label: 'No-Pressure Experience', category: 'praise', severity: 'positive', description: 'Respectful, consultative sales process without artificial urgency.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-10', slug: 'helpful-staff', label: 'Helpful Staff', category: 'praise', severity: 'positive', description: 'Professional, knowledgeable, and courteous dealership personnel.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-11', slug: 'fair-negotiation', label: 'Fair Negotiation', category: 'praise', severity: 'positive', description: 'Willingness to negotiate reasonably and honor commitments.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-12', slug: 'transparent-financing', label: 'Transparent Financing', category: 'praise', severity: 'positive', description: 'Clear F&I process with full disclosure of rates, terms, and optional products.', is_active: true, created_at: new Date().toISOString() },
  { id: 'tag-13', slug: 'positive-overall-experience', label: 'Positive Overall Experience', category: 'praise', severity: 'positive', description: 'High consumer satisfaction across all stages of the transaction.', is_active: true, created_at: new Date().toISOString() }
];

/**
 * In-memory fallback stores to guarantee graceful degradation
 * when developing locally without an active live Supabase connection.
 */
const inMemoryDealers: Map<string, Dealership> = new Map();
const inMemoryReviews: Map<string, Review> = new Map();
const inMemoryReviewTags: Map<string, string[]> = new Map(); // reviewId -> tagSlugs[]
const inMemoryEvidence: Map<string, ReviewEvidence> = new Map();
const inMemoryReports: Map<string, ReviewReport> = new Map();
const inMemoryClaims: Map<string, DealerClaim> = new Map();
const inMemoryResponses: Map<string, DealerResponse> = new Map();
const inMemoryAuditLogs: AdminAuditLog[] = [];

// Initialize seed data into memory store
DFW_DEALERSHIPS_SEED.forEach(seed => {
  const dealer = seedToDealership(seed, crypto.randomUUID());
  inMemoryDealers.set(dealer.id, dealer);
});

/**
 * Helper to check if a live configured Supabase client is available
 */
function isSupabaseLive(): boolean {
  return typeof process !== 'undefined' && 
         Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
}

/**
 * CarMatrix Dealer Intel Service
 */
export class DealerIntelService {
  /**
   * 1. SEARCH & LIST DEALERSHIPS
   */
  static async searchDealerships(rawParams: DealerSearchParamsInput): Promise<PaginatedResult<Dealership>> {
    const params = DealerSearchSchema.parse(rawParams);

    if (isSupabaseLive()) {
      try {
        let query = supabase
          .from('dealer_intel_dealerships')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .is('deleted_at', null);

        if (params.query) {
          query = query.or(`name.ilike.%${params.query}%,city.ilike.%${params.query}%,brands.cs.{${params.query}}`);
        }
        if (params.brand) {
          query = query.contains('brands', [params.brand]);
        }
        if (params.city) {
          query = query.ilike('city', params.city);
        }
        if (params.market) {
          query = query.eq('market', params.market);
        }
        if (params.minRating !== undefined && params.minRating > 0) {
          query = query.gte('overall_rating', params.minRating);
        }
        if (params.minTransparencyScore !== undefined && params.minTransparencyScore > 0) {
          query = query.gte('price_transparency_score', params.minTransparencyScore);
        }
        if (params.dealershipType) {
          query = query.eq('dealership_type', params.dealershipType);
        }

        // Sorting
        const sortColumnMap: Record<string, string> = {
          rating: 'overall_rating',
          transparency: 'price_transparency_score',
          reviews: 'review_count',
          name: 'name'
        };
        const sortCol = sortColumnMap[params.sortBy] || 'overall_rating';
        query = query.order(sortCol, { ascending: params.sortOrder === 'asc' });

        // Pagination
        const from = (params.page - 1) * params.pageSize;
        const to = from + params.pageSize - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (!error && data && data.length > 0) {
          return {
            data: data as Dealership[],
            total: count || data.length,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: Math.ceil((count || data.length) / params.pageSize)
          };
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to in-memory store:', err);
      }
    }

    // In-Memory Search Fallback
    let list = Array.from(inMemoryDealers.values()).filter(d => d.is_active && !d.deleted_at);

    if (params.query) {
      const q = params.query.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.brands.some(b => b.toLowerCase().includes(q)) ||
        d.aliases.some(a => a.toLowerCase().includes(q))
      );
    }
    if (params.brand) {
      list = list.filter(d => d.brands.some(b => b.toLowerCase() === params.brand?.toLowerCase()));
    }
    if (params.city) {
      list = list.filter(d => d.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params.market) {
      list = list.filter(d => d.market.toLowerCase() === params.market?.toLowerCase());
    }
    if (params.minRating !== undefined && params.minRating > 0) {
      list = list.filter(d => d.overall_rating >= params.minRating!);
    }
    if (params.minTransparencyScore !== undefined && params.minTransparencyScore > 0) {
      list = list.filter(d => d.price_transparency_score >= params.minTransparencyScore!);
    }
    if (params.dealershipType) {
      list = list.filter(d => d.dealership_type === params.dealershipType);
    }

    // Sort
    list.sort((a, b) => {
      let valA: any = a.overall_rating;
      let valB: any = b.overall_rating;
      if (params.sortBy === 'transparency') {
        valA = a.price_transparency_score;
        valB = b.price_transparency_score;
      } else if (params.sortBy === 'reviews') {
        valA = a.review_count;
        valB = b.review_count;
      } else if (params.sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return params.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return params.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = list.length;
    const from = (params.page - 1) * params.pageSize;
    const data = list.slice(from, from + params.pageSize);

    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize)
    };
  }

  /**
   * 2. GET DEALERSHIP BY SLUG
   */
  static async getDealershipBySlug(slug: string): Promise<Dealership | null> {
    if (!slug) return null;

    if (isSupabaseLive()) {
      try {
        const { data, error } = await supabase
          .from('dealer_intel_dealerships')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .is('deleted_at', null)
          .maybeSingle();

        if (!error && data) return data as Dealership;
      } catch (err) {
        console.warn('Supabase getDealershipBySlug failed, falling back:', err);
      }
    }

    for (const dealer of inMemoryDealers.values()) {
      if (dealer.slug === slug && dealer.is_active && !dealer.deleted_at) {
        return dealer;
      }
    }
    return null;
  }

  /**
   * 3. GET DEALERSHIP BY ID
   */
  static async getDealershipById(id: string): Promise<Dealership | null> {
    if (!id) return null;

    if (isSupabaseLive()) {
      try {
        const { data, error } = await supabase
          .from('dealer_intel_dealerships')
          .select('*')
          .eq('id', id)
          .is('deleted_at', null)
          .maybeSingle();

        if (!error && data) return data as Dealership;
      } catch (err) {
        console.warn('Supabase getDealershipById failed, falling back:', err);
      }
    }

    const found = inMemoryDealers.get(id);
    return (found && !found.deleted_at) ? found : null;
  }

  /**
   * 4. GET ALL UNIQUE BRANDS FOR FILTERING
   */
  static async getAvailableBrands(): Promise<string[]> {
    const brandsSet = new Set<string>();
    for (const dealer of inMemoryDealers.values()) {
      dealer.brands.forEach(b => brandsSet.add(b));
    }
    return Array.from(brandsSet).sort();
  }

  /**
   * 5. GET REVIEWS FOR A DEALERSHIP (PAGINATED & FILTERED)
   */
  static async getReviews(rawParams: ReviewSearchParamsInput): Promise<PaginatedResult<Review>> {
    const params = ReviewSearchSchema.parse(rawParams);

    if (isSupabaseLive()) {
      try {
        let query = supabase
          .from('dealer_intel_reviews')
          .select(`
            *,
            dealer_response:dealer_intel_responses(*),
            review_tags:dealer_intel_review_tags(
              tag:dealer_intel_tags(*)
            )
          `, { count: 'exact' })
          .eq('dealership_id', params.dealershipId)
          .eq('moderation_status', 'published')
          .is('deleted_at', null);

        if (params.experienceType) {
          query = query.eq('experience_type', params.experienceType);
        }
        if (params.rating) {
          query = query.eq('overall_rating', params.rating);
        }
        if (params.verifiedOnly) {
          query = query.eq('verification_status', 'verified_purchase');
        }

        // Sorting
        if (params.sortBy === 'recent') {
          query = query.order('created_at', { ascending: false });
        } else if (params.sortBy === 'rating_high') {
          query = query.order('overall_rating', { ascending: false });
        } else if (params.sortBy === 'rating_low') {
          query = query.order('overall_rating', { ascending: true });
        } else if (params.sortBy === 'helpful') {
          query = query.order('helpful_count', { ascending: false });
        }

        const from = (params.page - 1) * params.pageSize;
        const to = from + params.pageSize - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (!error && data) {
          const formattedReviews: Review[] = data.map((item: any) => ({
            ...item,
            tags: item.review_tags?.map((rt: any) => rt.tag).filter(Boolean) || [],
            dealer_response: Array.isArray(item.dealer_response) ? item.dealer_response[0] : item.dealer_response
          }));

          return {
            data: formattedReviews,
            total: count || data.length,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: Math.ceil((count || data.length) / params.pageSize)
          };
        }
      } catch (err) {
        console.warn('Supabase getReviews query failed, falling back:', err);
      }
    }

    // In-memory fallback
    let list = Array.from(inMemoryReviews.values()).filter(r => 
      r.dealership_id === params.dealershipId &&
      r.moderation_status === 'published' &&
      !r.deleted_at
    );

    if (params.experienceType) {
      list = list.filter(r => r.experience_type === params.experienceType);
    }
    if (params.rating) {
      list = list.filter(r => r.overall_rating === params.rating);
    }
    if (params.verifiedOnly) {
      list = list.filter(r => r.verification_status === 'verified_purchase');
    }
    if (params.tagSlug) {
      list = list.filter(r => {
        const slugs = inMemoryReviewTags.get(r.id) || [];
        return slugs.includes(params.tagSlug!);
      });
    }

    // Sort
    list.sort((a, b) => {
      if (params.sortBy === 'rating_high') return b.overall_rating - a.overall_rating;
      if (params.sortBy === 'rating_low') return a.overall_rating - b.overall_rating;
      if (params.sortBy === 'helpful') return b.helpful_count - a.helpful_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Attach tags and official responses
    const enriched = list.map(r => {
      const slugs = inMemoryReviewTags.get(r.id) || [];
      const tags = STANDARD_SEED_TAGS.filter(t => slugs.includes(t.slug));
      const dealer_response = inMemoryResponses.get(r.id) || null;
      return { ...r, tags, dealer_response };
    });

    const total = enriched.length;
    const from = (params.page - 1) * params.pageSize;
    const data = enriched.slice(from, from + params.pageSize);

    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize)
    };
  }

  /**
   * 6. CREATE A NEW CONSUMER REVIEW
   * Enforces server-side validation, duplicate review prevention, and triggers recalculation.
   */
  static async createReview(userId: string | null, rawInput: CreateReviewInput): Promise<Review> {
    const input = CreateReviewSchema.parse(rawInput);

    // Verify dealership exists
    const dealership = await this.getDealershipById(input.dealership_id);
    if (!dealership) {
      throw new Error(`Dealership with ID ${input.dealership_id} does not exist`);
    }

    // DUPLICATE REVIEW CHECK:
    // If authenticated, check if user has already reviewed this dealership for the same experience date
    if (userId) {
      for (const rev of inMemoryReviews.values()) {
        if (
          rev.user_id === userId &&
          rev.dealership_id === input.dealership_id &&
          rev.experience_date === input.experience_date &&
          !rev.deleted_at
        ) {
          throw new Error('Duplicate review rejected: You have already submitted a review for this dealership on this experience date.');
        }
      }
    }

    const reviewId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newReview: Review = {
      id: reviewId,
      dealership_id: input.dealership_id,
      user_id: userId,
      reviewer_display_name: input.reviewer_display_name,
      reviewer_city: input.reviewer_city || null,
      reviewer_state: input.reviewer_state || null,

      overall_rating: input.overall_rating,
      pricing_transparency_rating: input.pricing_transparency_rating || null,
      sales_pressure_rating: input.sales_pressure_rating || null,
      financing_integrity_rating: input.financing_integrity_rating || null,
      service_speed_rating: input.service_speed_rating || null,

      title: input.title,
      review_body: input.review_body,
      advice_for_other_buyers: input.advice_for_other_buyers || null,

      experience_date: input.experience_date,
      experience_type: input.experience_type,
      vehicle_year: input.vehicle_year || null,
      vehicle_make: input.vehicle_make || null,
      vehicle_model: input.vehicle_model || null,
      salesperson_name: input.salesperson_name || null,

      would_recommend: input.would_recommend,
      advertised_price_honored: input.advertised_price_honored ?? null,
      reported_doc_fee: input.reported_doc_fee ?? null,
      mandatory_addons_reported: input.mandatory_addons_reported,
      reported_addons: input.reported_addons,
      financing_terms_changed: input.financing_terms_changed,
      trade_in_lowball_reported: input.trade_in_lowball_reported,

      verification_status: 'unverified',
      moderation_status: 'published', // Published by default unless flagged
      helpful_count: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };

    // Live Supabase insertion attempt
    if (isSupabaseLive()) {
      try {
        const { error } = await supabase
          .from('dealer_intel_reviews')
          .insert(newReview);

        if (!error && input.tag_slugs.length > 0) {
          // Resolve tag IDs
          const { data: tagRecords } = await supabase
            .from('dealer_intel_tags')
            .select('id, slug')
            .in('slug', input.tag_slugs);

          if (tagRecords && tagRecords.length > 0) {
            const junctionRows = tagRecords.map((t: any) => ({
              review_id: reviewId,
              tag_id: t.id
            }));
            await supabase.from('dealer_intel_review_tags').insert(junctionRows);
          }
        }
      } catch (err) {
        console.warn('Supabase review insert failed, recording to in-memory store:', err);
      }
    }

    // Always maintain in-memory store
    inMemoryReviews.set(reviewId, newReview);
    inMemoryReviewTags.set(reviewId, input.tag_slugs);

    // Recalculate dealership aggregate stats
    this.recalculateDealershipMetrics(input.dealership_id);

    const tags = STANDARD_SEED_TAGS.filter(t => input.tag_slugs.includes(t.slug));
    return { ...newReview, tags };
  }

  /**
   * 7. MARK A REVIEW AS HELPFUL
   */
  static async markReviewHelpful(reviewId: string): Promise<number> {
    const review = inMemoryReviews.get(reviewId);
    if (!review) throw new Error('Review not found');

    review.helpful_count += 1;
    review.updated_at = new Date().toISOString();

    if (isSupabaseLive()) {
      try {
        await supabase
          .from('dealer_intel_reviews')
          .update({ helpful_count: review.helpful_count })
          .eq('id', reviewId);
      } catch (err) {
        console.warn('Supabase helpful count update failed:', err);
      }
    }

    return review.helpful_count;
  }

  /**
   * 8. SUBMIT AN OWNERSHIP CLAIM FOR A DEALERSHIP
   */
  static async submitDealerClaim(userId: string, rawInput: CreateClaimInput): Promise<DealerClaim> {
    if (!userId) throw new Error('Authentication required to claim a dealership');
    const input = CreateClaimSchema.parse(rawInput);

    const dealership = await this.getDealershipById(input.dealership_id);
    if (!dealership) throw new Error('Dealership not found');

    if (dealership.is_claimed) {
      throw new Error('This dealership profile is already claimed and verified. Contact support for dispute resolution.');
    }

    const claimId = crypto.randomUUID();
    const now = new Date().toISOString();

    const claim: DealerClaim = {
      id: claimId,
      dealership_id: input.dealership_id,
      claimant_user_id: userId,
      claimant_name: input.claimant_name,
      claimant_title: input.claimant_title,
      claimant_work_email: input.claimant_work_email,
      claimant_phone: input.claimant_phone,
      verification_notes: input.verification_notes || null,
      verification_doc_path: input.verification_doc_path || null,
      approval_status: 'pending_review',
      created_at: now,
      updated_at: now
    };

    if (isSupabaseLive()) {
      try {
        await supabase.from('dealer_intel_claims').insert(claim);
      } catch (err) {
        console.warn('Supabase claim insert failed:', err);
      }
    }

    inMemoryClaims.set(claimId, claim);
    return claim;
  }

  /**
   * 9. SUBMIT AN OFFICIAL DEALERSHIP RESPONSE TO A REVIEW
   * Strictly enforces that ONLY verified claimed representatives of THAT specific dealership can respond.
   */
  static async submitDealerResponse(userId: string, rawInput: CreateResponseInput): Promise<DealerResponse> {
    if (!userId) throw new Error('Authentication required to post an official response');
    const input = CreateResponseSchema.parse(rawInput);

    // Verify dealership
    const dealership = await this.getDealershipById(input.dealership_id);
    if (!dealership) throw new Error('Dealership not found');

    // SECURITY ENFORCEMENT: Dealership must be claimed by THIS user
    if (!dealership.is_claimed || dealership.claimed_by !== userId) {
      throw new Error('Unauthorized: Only the verified and approved representative of this dealership can post official responses.');
    }

    // Verify target review exists and belongs to this dealership
    const review = inMemoryReviews.get(input.review_id);
    if (!review || review.dealership_id !== input.dealership_id) {
      throw new Error('Review does not match the specified dealership');
    }

    // Check single response constraint
    if (inMemoryResponses.has(input.review_id)) {
      throw new Error('An official response has already been published for this review.');
    }

    const responseId = crypto.randomUUID();
    const now = new Date().toISOString();

    const response: DealerResponse = {
      id: responseId,
      review_id: input.review_id,
      dealership_id: input.dealership_id,
      responder_user_id: userId,
      responder_name: input.responder_name,
      responder_title: input.responder_title,
      response_body: input.response_body,
      moderation_status: 'published',
      created_at: now,
      updated_at: now,
      deleted_at: null
    };

    if (isSupabaseLive()) {
      try {
        await supabase.from('dealer_intel_responses').insert(response);
      } catch (err) {
        console.warn('Supabase response insert failed:', err);
      }
    }

    inMemoryResponses.set(input.review_id, response);
    return response;
  }

  /**
   * 10. REPORT A REVIEW (FLAG FOR MODERATION)
   */
  static async reportReview(userId: string | null, rawInput: CreateReportInput): Promise<ReviewReport> {
    const input = CreateReportSchema.parse(rawInput);

    const review = inMemoryReviews.get(input.review_id);
    if (!review) throw new Error('Target review not found');

    const reportId = crypto.randomUUID();
    const now = new Date().toISOString();

    const report: ReviewReport = {
      id: reportId,
      review_id: input.review_id,
      reporter_user_id: userId,
      reporter_type: input.reporter_type,
      reason: input.reason,
      explanation: input.explanation,
      status: 'pending',
      created_at: now,
      updated_at: now
    };

    if (isSupabaseLive()) {
      try {
        await supabase.from('dealer_intel_reports').insert(report);
      } catch (err) {
        console.warn('Supabase report insert failed:', err);
      }
    }

    inMemoryReports.set(reportId, report);
    return report;
  }

  /**
   * 11. RECORD PRIVATE EVIDENCE FILE POINTER
   * Stored in private vault with redaction confirmation. Never exposed to public.
   */
  static async registerReviewEvidence(userId: string, rawInput: CreateEvidenceInput): Promise<ReviewEvidence> {
    if (!userId) throw new Error('Authentication required to upload evidence');
    const input = CreateEvidenceSchema.parse(rawInput);

    const review = inMemoryReviews.get(input.review_id);
    if (!review) throw new Error('Review not found');

    // Verify ownership: only the review author can submit supporting documents
    if (review.user_id && review.user_id !== userId) {
      throw new Error('Unauthorized: You can only upload evidence for your own reviews.');
    }

    const evidenceId = crypto.randomUUID();
    const now = new Date().toISOString();

    const evidence: ReviewEvidence = {
      id: evidenceId,
      review_id: input.review_id,
      user_id: userId,
      file_storage_bucket: input.file_storage_bucket,
      file_storage_path: input.file_storage_path,
      original_filename: input.original_filename || null,
      file_size_bytes: input.file_size_bytes || null,
      mime_type: input.mime_type,
      document_type: input.document_type,
      redaction_confirmed_by_user: true,
      verification_status: 'pending_review',
      created_at: now,
      updated_at: now,
      deleted_at: null
    };

    if (isSupabaseLive()) {
      try {
        await supabase.from('dealer_intel_evidence').insert(evidence);
        // Update review verification status to pending_evidence
        await supabase
          .from('dealer_intel_reviews')
          .update({ verification_status: 'pending_evidence' })
          .eq('id', input.review_id);
      } catch (err) {
        console.warn('Supabase evidence insert failed:', err);
      }
    }

    inMemoryEvidence.set(evidenceId, evidence);
    review.verification_status = 'pending_evidence';
    return evidence;
  }

  /**
   * 12. GET ACTIVE STANDARDIZED TAGS
   */
  static async getTags(): Promise<Tag[]> {
    return STANDARD_SEED_TAGS;
  }

  /**
   * 13. ADMIN MODERATION: REVIEW LIFECYCLE & AUDIT LOG
   */
  static async moderateReview(
    adminUserId: string,
    rawInput: ModerateReviewInput,
    ipAddress?: string
  ): Promise<Review> {
    const input = ModerateReviewSchema.parse(rawInput);

    const review = inMemoryReviews.get(input.review_id);
    if (!review) throw new Error('Review not found');

    const previousState = { ...review };
    const now = new Date().toISOString();

    if (input.action === 'approve') {
      review.moderation_status = 'published';
      review.moderation_reason = null;
    } else if (input.action === 'reject') {
      review.moderation_status = 'rejected';
      review.moderation_reason = input.moderation_reason;
    } else if (input.action === 'flag') {
      review.moderation_status = 'flagged';
      review.moderation_reason = input.moderation_reason;
    } else if (input.action === 'soft_delete') {
      review.deleted_at = now;
      review.moderation_reason = input.moderation_reason;
    } else if (input.action === 'restore') {
      review.deleted_at = null;
      review.moderation_status = 'published';
    }

    if (input.verification_status) {
      review.verification_status = input.verification_status;
    }

    review.moderated_by = adminUserId;
    review.moderated_at = now;
    review.updated_at = now;

    // Record admin audit log
    const auditLog: AdminAuditLog = {
      id: crypto.randomUUID(),
      actor_user_id: adminUserId,
      actor_role: 'admin',
      action_type: input.action === 'soft_delete' ? 'review_soft_deleted' :
                   input.action === 'restore' ? 'review_restored' : 'review_moderated',
      target_type: 'review',
      target_id: input.review_id,
      previous_state: previousState,
      new_state: { ...review },
      reason: input.moderation_reason,
      ip_address: ipAddress || null,
      created_at: now
    };
    inMemoryAuditLogs.push(auditLog);

    if (isSupabaseLive()) {
      try {
        await supabase
          .from('dealer_intel_reviews')
          .update({
            moderation_status: review.moderation_status,
            moderation_reason: review.moderation_reason,
            verification_status: review.verification_status,
            deleted_at: review.deleted_at,
            moderated_by: adminUserId,
            moderated_at: now
          })
          .eq('id', input.review_id);

        await supabase.from('dealer_intel_audit_logs').insert(auditLog);
      } catch (err) {
        console.warn('Supabase moderateReview update failed:', err);
      }
    }

    // Refresh metrics
    this.recalculateDealershipMetrics(review.dealership_id);
    return review;
  }

  /**
   * 14. ADMIN MODERATION: DEALER CLAIM APPROVAL / REJECTION
   */
  static async moderateClaim(
    adminUserId: string,
    rawInput: ModerateClaimInput,
    ipAddress?: string
  ): Promise<DealerClaim> {
    const input = ModerateClaimSchema.parse(rawInput);

    const claim = inMemoryClaims.get(input.claim_id);
    if (!claim) throw new Error('Claim not found');

    const dealership = inMemoryDealers.get(claim.dealership_id);
    if (!dealership) throw new Error('Associated dealership not found');

    const previousState = { ...claim };
    const now = new Date().toISOString();

    if (input.action === 'approve') {
      claim.approval_status = 'approved';
      dealership.is_claimed = true;
      dealership.claimed_by = claim.claimant_user_id;
      dealership.claimed_at = now;
      dealership.verified_contact_email = claim.claimant_work_email;
    } else if (input.action === 'reject') {
      claim.approval_status = 'rejected';
      claim.rejection_reason = input.notes || null;
    } else if (input.action === 'revoke') {
      claim.approval_status = 'revoked';
      dealership.is_claimed = false;
      dealership.claimed_by = null;
      dealership.claimed_at = null;
    }

    claim.reviewed_by = adminUserId;
    claim.reviewed_at = now;
    claim.updated_at = now;

    // Record audit log
    const auditLog: AdminAuditLog = {
      id: crypto.randomUUID(),
      actor_user_id: adminUserId,
      actor_role: 'admin',
      action_type: input.action === 'approve' ? 'claim_approved' :
                   input.action === 'reject' ? 'claim_rejected' : 'claim_revoked',
      target_type: 'claim',
      target_id: input.claim_id,
      previous_state: previousState,
      new_state: { ...claim },
      reason: input.notes || null,
      ip_address: ipAddress || null,
      created_at: now
    };
    inMemoryAuditLogs.push(auditLog);

    return claim;
  }

  /**
   * 15. INTERNAL AGGREGATE RECALCULATION HELPER
   * Computes ratings, transparency score (0-100), doc fee average, and flag percentages.
   */
  static recalculateDealershipMetrics(dealershipId: string): void {
    const dealer = inMemoryDealers.get(dealershipId);
    if (!dealer) return;

    const publishedReviews = Array.from(inMemoryReviews.values()).filter(r =>
      r.dealership_id === dealershipId &&
      r.moderation_status === 'published' &&
      !r.deleted_at
    );

    const count = publishedReviews.length;
    dealer.review_count = count;

    if (count === 0) {
      dealer.overall_rating = 0.0;
      dealer.verified_review_count = 0;
      dealer.price_transparency_score = 50; // Neutral baseline
      dealer.would_recommend_pct = 0;
      dealer.avg_reported_doc_fee = null;
      dealer.advertised_price_honored_pct = 0;
      dealer.mandatory_addons_reported_pct = 0;
      dealer.updated_at = new Date().toISOString();
      return;
    }

    const verifiedCount = publishedReviews.filter(r => r.verification_status === 'verified_purchase').length;
    const ratingSum = publishedReviews.reduce((sum, r) => sum + r.overall_rating, 0);
    const recommendCount = publishedReviews.filter(r => r.would_recommend).length;

    // Doc fee
    const docFees = publishedReviews.map(r => r.reported_doc_fee).filter((f): f is number => f !== null && f !== undefined);
    const avgDocFee = docFees.length > 0 ? docFees.reduce((a, b) => a + b, 0) / docFees.length : null;

    // Price honored
    const priceHonoredEvals = publishedReviews.filter(r => r.advertised_price_honored !== null && r.advertised_price_honored !== undefined);
    const priceHonoredCount = priceHonoredEvals.filter(r => r.advertised_price_honored === true).length;
    const priceHonoredPct = priceHonoredEvals.length > 0 ? Math.round((priceHonoredCount / priceHonoredEvals.length) * 100) : 0;

    // Addons
    const addonsReportedCount = publishedReviews.filter(r => r.mandatory_addons_reported).length;
    const addonsPct = Math.round((addonsReportedCount / count) * 100);

    // Transparency index calculation (0-100)
    const transparencyRatings = publishedReviews
      .map(r => r.pricing_transparency_rating)
      .filter((tr): tr is number => tr !== null && tr !== undefined);
    const avgTransp = transparencyRatings.length > 0
      ? transparencyRatings.reduce((a, b) => a + b, 0) / transparencyRatings.length
      : 3.0;

    const baseScore = (avgTransp / 5.0) * 50;
    const priceWeight = priceHonoredEvals.length > 0 ? (priceHonoredCount / priceHonoredEvals.length) * 30 : 15;
    const addonPenalty = (1.0 - (addonsReportedCount / count)) * 20;
    const finalTransparencyScore = Math.max(0, Math.min(100, Math.round(baseScore + priceWeight + addonPenalty)));

    dealer.overall_rating = Math.round((ratingSum / count) * 100) / 100;
    dealer.verified_review_count = verifiedCount;
    dealer.would_recommend_pct = Math.round((recommendCount / count) * 100);
    dealer.avg_reported_doc_fee = avgDocFee !== null ? Math.round(avgDocFee * 100) / 100 : null;
    dealer.advertised_price_honored_pct = priceHonoredPct;
    dealer.mandatory_addons_reported_pct = addonsPct;
    dealer.price_transparency_score = finalTransparencyScore;
    dealer.updated_at = new Date().toISOString();
  }

  /**
   * Helper to inspect audit logs (Admin / Tests)
   */
  static getAuditLogs(): AdminAuditLog[] {
    return [...inMemoryAuditLogs];
  }

  /**
   * Helper to inspect stored evidence (Strictly Admin / Tests - never public)
   */
  static getEvidenceByReviewId(reviewId: string): ReviewEvidence[] {
    return Array.from(inMemoryEvidence.values()).filter(e => e.review_id === reviewId && !e.deleted_at);
  }
}
