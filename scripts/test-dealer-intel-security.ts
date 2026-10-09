import { DealerIntelService } from '../src/services/dealerIntelService';
import {
  CreateReviewSchema,
  CreateClaimSchema,
  CreateResponseSchema,
  CreateEvidenceSchema,
  DealershipSchema
} from '../src/services/dealerIntelValidation';
import { DFW_DEALERSHIPS_SEED } from '../src/services/dfwDealerSeedData';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, failureDetail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${failureDetail ? ` -> ${failureDetail}` : ''}`);
    testsFailed++;
  }
}

async function runSecurityTestSuite() {
  console.log('================================================================');
  console.log('🛡️  CarMatrix — Dealer Intel™ Security & Integrity Test Suite');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. INPUT VALIDATION & BOUNDARY ENFORCEMENT
  // ---------------------------------------------------------------------------
  console.log('📦 TEST GROUP 1: Server-Side Zod Validation & Schema Boundaries');

  // Test 1.1: Rating bounds (must be 1-5 integer)
  try {
    CreateReviewSchema.parse({
      dealership_id: crypto.randomUUID(),
      overall_rating: 6, // Invalid
      title: 'Invalid Rating Test',
      review_body: 'This is a test review body with sufficient characters.',
      experience_date: '2026-01-01',
      experience_type: 'purchased',
      would_recommend: true
    });
    assert(false, 'Should reject overall_rating > 5');
  } catch (err: any) {
    assert(true, 'Rejects overall_rating > 5 (out of bounds)');
  }

  try {
    CreateReviewSchema.parse({
      dealership_id: crypto.randomUUID(),
      overall_rating: 0, // Invalid
      title: 'Invalid Rating Test',
      review_body: 'This is a test review body with sufficient characters.',
      experience_date: '2026-01-01',
      experience_type: 'purchased',
      would_recommend: true
    });
    assert(false, 'Should reject overall_rating < 1');
  } catch (err: any) {
    assert(true, 'Rejects overall_rating < 1 (out of bounds)');
  }

  // Test 1.2: Future date rejection
  try {
    CreateReviewSchema.parse({
      dealership_id: crypto.randomUUID(),
      overall_rating: 4,
      title: 'Future Date Test',
      review_body: 'This is a test review body with sufficient characters.',
      experience_date: '2099-12-31', // Far in future
      experience_type: 'purchased',
      would_recommend: true
    });
    assert(false, 'Should reject future experience date');
  } catch (err: any) {
    assert(true, 'Rejects experience date occurring in the future');
  }

  // Test 1.3: Mandatory PII redaction confirmation on evidence upload
  try {
    CreateEvidenceSchema.parse({
      review_id: crypto.randomUUID(),
      file_storage_path: 'evidence/buyer-order-01.pdf',
      mime_type: 'application/pdf',
      document_type: 'buyer_order',
      redaction_confirmed_by_user: false // Violation
    });
    assert(false, 'Should reject unconfirmed PII redaction');
  } catch (err: any) {
    assert(true, 'Strictly requires redaction_confirmed_by_user === true');
  }

  // Test 1.4: Corporate email validation for dealer claims
  try {
    CreateClaimSchema.parse({
      dealership_id: crypto.randomUUID(),
      claimant_name: 'John Doe',
      claimant_title: 'General Manager',
      claimant_work_email: 'not-an-email', // Invalid
      claimant_phone: '(214) 555-0199'
    });
    assert(false, 'Should reject malformed email in dealer claim');
  } catch (err: any) {
    assert(true, 'Enforces RFC email format on dealer ownership claims');
  }

  // Test 1.5: Phone format validation
  try {
    CreateClaimSchema.parse({
      dealership_id: crypto.randomUUID(),
      claimant_name: 'John Doe',
      claimant_title: 'General Manager',
      claimant_work_email: 'john@sewell.com',
      claimant_phone: '123' // Invalid
    });
    assert(false, 'Should reject malformed phone number');
  } catch (err: any) {
    assert(true, 'Enforces US phone number format on dealer claims');
  }

  console.log('\n----------------------------------------------------------------');
  // ---------------------------------------------------------------------------
  // 2. DFW SEED DATA INTEGRITY (ZERO FABRICATED REVIEWS MANDATE)
  // ---------------------------------------------------------------------------
  console.log('🏙️  TEST GROUP 2: DFW Seed Data & Truth In Data Integrity');

  assert(DFW_DEALERSHIPS_SEED.length >= 50, `Seeded with at least 50 DFW dealerships (found ${DFW_DEALERSHIPS_SEED.length})`);

  let allSeedsValid = true;
  let hasFabricatedReviews = false;

  for (const seed of DFW_DEALERSHIPS_SEED) {
    try {
      DealershipSchema.parse(seed);
    } catch (e: any) {
      allSeedsValid = false;
      console.error(`Invalid seed entry: ${seed.name}`, e);
    }
  }
  assert(allSeedsValid, 'All 50+ DFW dealerships pass strict DealershipSchema validation');

  const { data: searchResults } = await DealerIntelService.searchDealerships({ market: 'DFW', pageSize: 100 });
  const fabricatedReviewsFound = searchResults.some(d => d.review_count > 0 || d.overall_rating > 0);
  assert(!fabricatedReviewsFound, 'MANDATE SATISFIED: Zero fabricated reviews or ratings in seed database');

  console.log('\n----------------------------------------------------------------');
  // ---------------------------------------------------------------------------
  // 3. DUPLICATE REVIEW PREVENTION & ATOMIC METRIC RECALCULATION
  // ---------------------------------------------------------------------------
  console.log('🔒 TEST GROUP 3: Duplicate Review Prevention & Metric Recalculation');

  const testDealer = searchResults[0];
  const testUserId = crypto.randomUUID();
  const experienceDate = '2026-03-15';

  // Submit legitimate review 1
  const review1 = await DealerIntelService.createReview(testUserId, {
    dealership_id: testDealer.id,
    reviewer_display_name: 'DFW Buyer 1',
    overall_rating: 5,
    pricing_transparency_rating: 5,
    title: 'Flawless upfront transaction',
    review_body: 'Everything was clearly itemized without any forced dealer add-ons.',
    experience_date: experienceDate,
    experience_type: 'purchased',
    would_recommend: true,
    advertised_price_honored: true,
    reported_doc_fee: 150,
    mandatory_addons_reported: false,
    tag_slugs: ['clear-pricing', 'no-pressure-experience']
  });
  assert(Boolean(review1.id), 'Successfully submitted initial legitimate consumer review');

  // Attempt duplicate review submission (same user, same dealer, same date)
  let duplicatePrevented = false;
  try {
    await DealerIntelService.createReview(testUserId, {
      dealership_id: testDealer.id,
      reviewer_display_name: 'DFW Buyer 1 (Duplicate)',
      overall_rating: 1,
      title: 'Second review attempt',
      review_body: 'Attempting to spam another review on the exact same date.',
      experience_date: experienceDate,
      experience_type: 'purchased',
      would_recommend: false,
      tag_slugs: []
    });
  } catch (err: any) {
    if (err.message.includes('Duplicate review rejected')) {
      duplicatePrevented = true;
    }
  }
  assert(duplicatePrevented, 'Blocked duplicate review from same user/dealership/date (composite key protection)');

  // Verify metric recalculation
  const updatedDealer = await DealerIntelService.getDealershipById(testDealer.id);
  assert(updatedDealer?.review_count === 1, `Dealer review_count recalculated accurately to 1 (actual: ${updatedDealer?.review_count})`);
  assert(updatedDealer?.overall_rating === 5.0, `Dealer overall_rating recalculated accurately to 5.00 (actual: ${updatedDealer?.overall_rating})`);
  assert(updatedDealer?.avg_reported_doc_fee === 150, `Dealer avg_reported_doc_fee recalculated accurately to \$150`);
  assert(updatedDealer?.price_transparency_score! >= 90, `Dealer price_transparency_score reflects high transparency (${updatedDealer?.price_transparency_score})`);

  console.log('\n----------------------------------------------------------------');
  // ---------------------------------------------------------------------------
  // 4. DEALER RESPONSE PERMISSIONS (AUTHORIZATION CONTROLS)
  // ---------------------------------------------------------------------------
  console.log('🏛️  TEST GROUP 4: Dealership Representative Permissions & Official Responses');

  const randomUser = crypto.randomUUID();
  let unauthorizedResponseBlocked = false;

  // Attempt response by non-claimed user
  try {
    await DealerIntelService.submitDealerResponse(randomUser, {
      review_id: review1.id,
      dealership_id: testDealer.id,
      responder_name: 'Impostor',
      responder_title: 'Sales Rep',
      response_body: 'We are responding to this review without verification.'
    });
  } catch (err: any) {
    if (err.message.includes('Unauthorized: Only the verified and approved representative')) {
      unauthorizedResponseBlocked = true;
    }
  }
  assert(unauthorizedResponseBlocked, 'Unauthorized user blocked from posting official dealer response');

  // Submit and approve dealer claim
  const claimUser = crypto.randomUUID();
  const adminUserId = crypto.randomUUID();
  const claim = await DealerIntelService.submitDealerClaim(claimUser, {
    dealership_id: testDealer.id,
    claimant_name: 'Robert Sewell',
    claimant_title: 'General Manager',
    claimant_work_email: 'rsewell@sewelldfw.com',
    claimant_phone: '(214) 555-0100'
  });
  assert(claim.approval_status === 'pending_review', 'Dealer claim entered into pending_review state');

  // Admin approves claim
  await DealerIntelService.moderateClaim(adminUserId, {
    claim_id: claim.id,
    action: 'approve',
    notes: 'Verified dealership ownership via Texas DMV dealer license registry.'
  });

  const verifiedDealer = await DealerIntelService.getDealershipById(testDealer.id);
  assert(verifiedDealer?.is_claimed === true && verifiedDealer?.claimed_by === claimUser, 'Dealership ownership successfully bound to verified claimant');

  // Verified dealer now responds
  const dealerResponse = await DealerIntelService.submitDealerResponse(claimUser, {
    review_id: review1.id,
    dealership_id: testDealer.id,
    responder_name: 'Robert Sewell',
    responder_title: 'General Manager',
    response_body: 'Thank you for your business and for recognizing our transparent pricing commitment.'
  });
  assert(Boolean(dealerResponse.id), 'Verified dealer representative successfully published official response');

  // Exactly one response allowed per review
  let duplicateResponseBlocked = false;
  try {
    await DealerIntelService.submitDealerResponse(claimUser, {
      review_id: review1.id,
      dealership_id: testDealer.id,
      responder_name: 'Robert Sewell',
      responder_title: 'General Manager',
      response_body: 'Second response attempt.'
    });
  } catch (err: any) {
    if (err.message.includes('already been published')) {
      duplicateResponseBlocked = true;
    }
  }
  assert(duplicateResponseBlocked, 'Enforced single official response constraint per consumer review');

  console.log('\n----------------------------------------------------------------');
  // ---------------------------------------------------------------------------
  // 5. PRIVATE EVIDENCE ISOLATION & ACCESS CONTROL
  // ---------------------------------------------------------------------------
  console.log('🔐 TEST GROUP 5: Private Evidence Isolation (Zero Public Leakage)');

  // Unauthorized evidence upload attempt (User B uploading for User A's review)
  let unauthorizedEvidenceBlocked = false;
  try {
    await DealerIntelService.registerReviewEvidence(crypto.randomUUID(), {
      review_id: review1.id,
      file_storage_bucket: 'dealer-intel-evidence',
      file_storage_path: 'evidence/malicious-doc.pdf',
      mime_type: 'application/pdf',
      document_type: 'buyer_order',
      redaction_confirmed_by_user: true
    });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      unauthorizedEvidenceBlocked = true;
    }
  }
  assert(unauthorizedEvidenceBlocked, 'Non-author blocked from attaching evidence to another user review');

  // Authorized author registers private evidence
  const evidenceRecord = await DealerIntelService.registerReviewEvidence(testUserId, {
    review_id: review1.id,
    file_storage_bucket: 'dealer-intel-evidence',
    file_storage_path: 'evidence/buyer-order-signed-redacted.pdf',
    original_filename: 'buyer_order_redacted.pdf',
    mime_type: 'application/pdf',
    document_type: 'buyer_order',
    redaction_confirmed_by_user: true
  });
  assert(evidenceRecord.verification_status === 'pending_review', 'Evidence registered into private vault with pending_review status');

  // Verify public review query NEVER contains raw evidence storage path
  const publicReviews = await DealerIntelService.getReviews({ dealershipId: testDealer.id });
  const firstReview = publicReviews.data[0];
  assert(!('evidence' in firstReview) && !('file_storage_path' in firstReview), 'VERIFIED: Public review query contains zero evidence pointers or storage paths');

  console.log('\n----------------------------------------------------------------');
  // ---------------------------------------------------------------------------
  // 6. MODERATION, SOFT-DELETION, AND AUDIT LOG RETENTION
  // ---------------------------------------------------------------------------
  console.log('⚖️  TEST GROUP 6: Symmetrical Moderation, Soft-Deletion, & Audit Logs');

  // Admin verifies review evidence
  await DealerIntelService.moderateReview(adminUserId, {
    review_id: review1.id,
    action: 'approve',
    moderation_reason: 'Verified buyer order doc fee matches reported amount.',
    verification_status: 'verified_purchase'
  });

  const verifiedReviewQuery = await DealerIntelService.getReviews({ dealershipId: testDealer.id });
  assert(verifiedReviewQuery.data[0].verification_status === 'verified_purchase', 'Review verification status elevated to verified_purchase');

  // Admin soft-deletes a review
  await DealerIntelService.moderateReview(adminUserId, {
    review_id: review1.id,
    action: 'soft_delete',
    moderation_reason: 'Testing soft-delete removal from public indices.'
  });

  // Check public search: soft-deleted review must not appear
  const publicAfterDelete = await DealerIntelService.getReviews({ dealershipId: testDealer.id });
  assert(publicAfterDelete.data.length === 0, 'Soft-deleted review is immediately hidden from public queries');

  // Check aggregate recalculation: dealer metrics revert
  const dealerAfterDelete = await DealerIntelService.getDealershipById(testDealer.id);
  assert(dealerAfterDelete?.review_count === 0, 'Dealer review_count reverted to 0 following soft-deletion');

  // Check Audit Logs
  const auditLogs = DealerIntelService.getAuditLogs();
  assert(auditLogs.length >= 3, `Audit log recorded ${auditLogs.length} state transitions (claim approval, evidence verification, soft deletion)`);
  assert(auditLogs.some(l => l.action_type === 'review_soft_deleted'), 'Audit log explicitly captured review_soft_deleted with reason');

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite().catch(err => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
