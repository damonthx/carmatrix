/**
 * CarMatrix Affiliate & Monetization Configuration
 * 
 * Central hub for all third-party affiliate partners across:
 * - Auto Financing & Refinance (myAutoloan, LightStream, SuperMoney)
 * - Auto Insurance Comparison (The Zebra, Insurify, EverQuote)
 * - Vehicle History Reports (VinAudit, EpicVIN, Bumper)
 * - Pre-Purchase Mobile Mechanical Inspections (Lemon Squad, POMCAR)
 * - Extended Warranty & Breakdown Coverage (CARCHEX, Endurance)
 * - Instant Cash Trade-In Offers (Peddle, Carvana)
 * 
 * Instructions:
 * 1. Sign up on Impact.com, CJ.com, or direct partner portals.
 * 2. Paste your approved affiliate tracking URL into the respective partner below.
 * 3. Toggle `isEnabled: true` to display the callout / button live across the site.
 */

export type AffiliateCategory = 
  | 'finance'
  | 'insurance'
  | 'history'
  | 'inspection'
  | 'warranty'
  | 'tradein';

export interface AffiliatePartner {
  id: string;
  name: string;
  category: AffiliateCategory;
  network: 'Impact.com' | 'CJ Affiliate' | 'Direct Partner' | 'ShareASale' | 'Other';
  isEnabled: boolean;
  headline: string;
  description: string;
  ctaText: string;
  badgeText?: string;
  /** Primary affiliate tracking URL provided by the network */
  url: string;
  /** Optional fallback / default query parameters */
  defaultParams?: Record<string, string>;
  payoutNote?: string;
}

export interface AffiliateConfig {
  /** Global master switch: set false to disable all affiliate links sitewide */
  enableAffiliatesSitewide: boolean;
  /** Standard FTC compliance disclosure displayed near affiliate links */
  ftcDisclosureText: string;
  /** Individual partner definitions */
  partners: Record<string, AffiliatePartner>;
}

export const AFFILIATE_CONFIG: AffiliateConfig = {
  enableAffiliatesSitewide: true,

  ftcDisclosureText: 
    "Transparency Disclosure: CarMatrix may receive compensation from partner links at no additional cost to you. This does not affect our objective algorithmic scores, fee audits, or editorial integrity.",

  partners: {
    // -------------------------------------------------------------------------
    // 1. AUTO FINANCING & PRE-QUALIFICATION
    // Placement: Auto Loan Calculator & Lease vs. Buy Simulator
    // -------------------------------------------------------------------------
    myautoloan: {
      id: 'myautoloan',
      name: 'myAutoloan',
      category: 'finance',
      network: 'Impact.com',
      isEnabled: false, // Switch to true when approved
      headline: "Don't accept marked-up dealer financing rates",
      description: "Compare up to 4 real, pre-approved loan offers from top national lenders in 2 minutes without affecting your credit score.",
      ctaText: "Check Pre-Approved Rates",
      badgeText: "Soft Credit Pull",
      url: "https://www.myautoloan.com/?aff_id=YOUR_MYAUTOLOAN_ID",
      payoutNote: "$20–$45 per qualified lead / $150+ funded"
    },
    lightstream: {
      id: 'lightstream',
      name: 'LightStream (Truist Bank)',
      category: 'finance',
      network: 'Impact.com',
      isEnabled: false,
      headline: "Low fixed-rate auto loans for good credit",
      description: "Simple online loan process with zero fees, competitive rates, and same-day funding available.",
      ctaText: "Explore Loan Rates",
      badgeText: "No Fees",
      url: "https://www.lightstream.com/?aff_id=YOUR_LIGHTSTREAM_ID",
      payoutNote: "$150–$350 per funded loan"
    },

    // -------------------------------------------------------------------------
    // 2. AUTO INSURANCE COMPARISON
    // Placement: 5-Year Ownership TCO Calculator (Insurance Line Item)
    // -------------------------------------------------------------------------
    thezebra: {
      id: 'thezebra',
      name: 'The Zebra',
      category: 'insurance',
      network: 'Impact.com',
      isEnabled: false, // Switch to true when approved
      headline: "Compare real auto insurance rates for this vehicle",
      description: "Compare quotes across 100+ top insurance carriers side-by-side to lock in your lowest annual rate.",
      ctaText: "Compare Insurance Quotes",
      badgeText: "Free Comparison",
      url: "https://www.thezebra.com/?aff_id=YOUR_ZEBRA_ID",
      payoutNote: "$15–$45 per completed quote"
    },
    insurify: {
      id: 'insurify',
      name: 'Insurify',
      category: 'insurance',
      network: 'Impact.com',
      isEnabled: false,
      headline: "Unlock carrier discounts for your target car",
      description: "Save an average of $540/year by comparing quotes tailored to your vehicle's safety features.",
      ctaText: "See Carrier Rates",
      badgeText: "Save $500+",
      url: "https://insurify.com/?aff_id=YOUR_INSURIFY_ID",
      payoutNote: "$18–$40 per completed quote"
    },

    // -------------------------------------------------------------------------
    // 3. VEHICLE HISTORY & ACCIDENT REPORTS
    // Placement: Free VIN Decoder & NHTSA Recall Scanner
    // -------------------------------------------------------------------------
    vinaudit: {
      id: 'vinaudit',
      name: 'VinAudit',
      category: 'history',
      network: 'Direct Partner',
      isEnabled: false, // Switch to true when approved
      headline: "Check full accident history, salvage titles & liens",
      description: "Official NMVTIS-approved vehicle history report covering insurance total losses, title brands, and odometer rollbacks.",
      ctaText: "Get Full History Report",
      badgeText: "NMVTIS Official",
      url: "https://www.vinaudit.com/partner/?aid=YOUR_VINAUDIT_ID",
      payoutNote: "30%–50% rev-share ($5–$12 per report)"
    },
    epicvin: {
      id: 'epicvin',
      name: 'EpicVIN',
      category: 'history',
      network: 'Impact.com',
      isEnabled: false,
      headline: "Verify vehicle past before buying",
      description: "Uncover hidden salvage damage, past auction photos, and theft history.",
      ctaText: "Check Vehicle History",
      badgeText: "Auction Photos",
      url: "https://epicvin.com/?aff_id=YOUR_EPICVIN_ID",
      payoutNote: "$8–$15 per report"
    },

    // -------------------------------------------------------------------------
    // 4. PRE-PURCHASE MOBILE MECHANICAL INSPECTIONS (PPI)
    // Placement: Inspection Checklist & Printable Test-Drive Dossier
    // -------------------------------------------------------------------------
    lemonsquad: {
      id: 'lemonsquad',
      name: 'Lemon Squad',
      category: 'inspection',
      network: 'Direct Partner',
      isEnabled: false, // Switch to true when approved
      headline: "Send an ASE-Certified mobile mechanic to the dealer",
      description: "Comprehensive 100+ point mechanical, paint depth, and road test inspection performed directly on the dealership lot.",
      ctaText: "Book Mobile Inspection",
      badgeText: "ASE Certified",
      url: "https://lemonsquad.com/?ref=YOUR_LEMONSQUAD_REF",
      payoutNote: "$25–$50 per booked inspection"
    },

    // -------------------------------------------------------------------------
    // 5. EXTENDED VEHICLE WARRANTIES & BREAKDOWN PROTECTION
    // Placement: Depreciation Curve (Year 3–4 Sweet Spot) & Valuation Estimator
    // -------------------------------------------------------------------------
    carchex: {
      id: 'carchex',
      name: 'CARCHEX',
      category: 'warranty',
      network: 'CJ Affiliate',
      isEnabled: false, // Switch to true when approved
      headline: "Protect against expensive post-warranty mechanical failures",
      description: "Skip dealer finance office markups. Get direct-to-consumer coverage with 24/7 roadside assistance.",
      ctaText: "Get Instant Warranty Quote",
      badgeText: "Factory Match",
      url: "https://www.carchex.com/?aff_id=YOUR_CARCHEX_ID",
      payoutNote: "$200–$500 per policy sale"
    },
    endurance: {
      id: 'endurance',
      name: 'Endurance Warranty',
      category: 'warranty',
      network: 'CJ Affiliate',
      isEnabled: false,
      headline: "Direct administrator warranty protection",
      description: "Award-winning breakdown protection honored by any ASE-certified mechanic nationwide.",
      ctaText: "View Coverage Plans",
      badgeText: "Top Rated",
      url: "https://www.endurancewarranty.com/?aff_id=YOUR_ENDURANCE_ID",
      payoutNote: "$250–$600 per policy sale"
    },

    // -------------------------------------------------------------------------
    // 6. INSTANT CASH TRADE-IN / BUYING OFFERS
    // Placement: Trade-In & Valuation Estimator
    // -------------------------------------------------------------------------
    peddle: {
      id: 'peddle',
      name: 'Peddle',
      category: 'tradein',
      network: 'CJ Affiliate',
      isEnabled: false, // Switch to true when approved
      headline: "Get an instant, guaranteed cash offer for your current car",
      description: "Free home pickup, instant payment on the spot, and no dealership trade-in lowballs.",
      ctaText: "Get Instant Cash Offer",
      badgeText: "Guaranteed Offer",
      url: "https://www.peddle.com/?aff_id=YOUR_PEDDLE_ID",
      payoutNote: "$40–$100 per completed purchase"
    },
  }
};

/**
 * Generates an affiliate URL with optional contextual query parameters (e.g. VIN, UTMs).
 */
export function getAffiliateUrl(
  partnerId: string, 
  extraParams?: Record<string, string>
): string | null {
  if (!AFFILIATE_CONFIG.enableAffiliatesSitewide) return null;

  const partner = AFFILIATE_CONFIG.partners[partnerId];
  if (!partner || !partner.isEnabled) return null;

  try {
    const url = new URL(partner.url);
    
    // Append default tracking
    url.searchParams.set('utm_source', 'carmatrix');
    url.searchParams.set('utm_medium', 'affiliate_link');
    url.searchParams.set('utm_campaign', partner.category);

    // Append extra runtime params (like VIN or vehicle make)
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });
    }

    return url.toString();
  } catch {
    // If URL parsing fails, return raw string
    return partner.url;
  }
}

/**
 * Returns the first active partner in a given category, or null if none are enabled.
 */
export function getActivePartnerByCategory(category: AffiliateCategory): AffiliatePartner | null {
  if (!AFFILIATE_CONFIG.enableAffiliatesSitewide) return null;

  const partners = Object.values(AFFILIATE_CONFIG.partners);
  return partners.find(p => p.category === category && p.isEnabled) || null;
}
