# CarMatrix — Dealer Intel™ Product Brief

> **"Know the dealer before you make the deal."**  
> Companion to the CarMatrix brand promise: *"Never Step onto a Dealership Lot Unarmed."*

---

## 1. Executive Summary

CarMatrix empowers vehicle shoppers with transparent math, hidden-fee detectors, and institutional intelligence. Today, consumers can calculate their true 5-year total cost of ownership (TCO), decode safety recalls, benchmark statutory state doc fees, and audit dealer quotes for junk fees. 

**Dealer Intel™** completes the consumer protection loop. It is a consumer-powered dealership intelligence and review ecosystem designed to reveal dealership sales practices *before* a shopper ever visits a showroom. 

Rather than generic, easily gamed star ratings, Dealer Intel focuses on **verifiable transactional transparency**:
* Did the dealer honor the advertised internet price?
* Were there mandatory, non-negotiable add-ons (nitrogen, etch, ceramic coat)?
* Did financing terms change between sales desk and the F&I closing office?
* How does the dealer's doc fee compare to state statutory averages?
* Did the dealership deliver an exceptional, pressure-free transaction?

### Initial Launch Market: Dallas–Fort Worth (DFW)
Dealer Intel launches first in the **Dallas–Fort Worth (DFW) metroplex**—one of the largest, most competitive automotive retail corridors in North America. The data architecture and UX are built to scale seamlessly nationwide across all 50 states.

---

## 2. Target Personas

### 2.1 The Defensive Consumer Shopper ("Alex")
* **Goal:** Avoid bait-and-switch pricing, unexpected dealer add-on fees, and high-pressure finance office tactics.
* **Pain Points:** Finds a car online priced at $28,000, arrives at the store to find a $2,995 mandatory protection package and an inflated $799 doc fee added to the buyer's order.
* **Needs:** Verifiable data on whether a dealership is honest about out-the-door pricing, which dealers in DFW are reputable, and proof from previous buyers.

### 2.2 The Transparent Dealership Representative ("Marcus - GM / Customer Relations")
* **Goal:** Differentiate their dealership as an honest, transparent retailer in a market flooded with deceptive advertising.
* **Pain Points:** Lumped in with dishonest competitors; frustrated by unverified, malicious reviews from individuals who never set foot in the store.
* **Needs:** A verified claim process, an authenticated channel to respond to customer experiences publicly, and public recognition for fee transparency.

### 2.3 The CarMatrix Moderator / Community Steward
* **Goal:** Maintain unquestioned consumer trust, protect sensitive consumer PII, prevent astroturfing, and ensure strict neutrality.
* **Needs:** A moderation queue to review redacted buyer orders, verify transaction evidence, and apply standardized moderation standards equally to positive and negative reviews.

---

## 3. Core Product Objectives & Requirements

| # | Objective | Product Requirement |
|---|---|---|
| **1** | **Pre-Visit Dealership Research** | Search and browse dealerships by brand, location, metro area (DFW initial), and rating. |
| **2** | **Multi-Dimensional Star & Practice Ratings** | Measure Overall Satisfaction, Price Transparency, Sales Pressure, and F&I Office Integrity (1–5 scale). |
| **3** | **Reported Dealer Practices (Intelligence Badges)** | Specific structured metrics tracking: (a) Advertised Price Honored, (b) Mandatory Add-ons, (c) F&I APR markup/switchback, (d) Doc Fee charged vs. TX benchmark. |
| **4** | **Highlighting Positive Dealerships** | "Transparent Dealer" and "Zero Junk Fee" badges honoring top-performing retailers who respect consumer pricing. |
| **5** | **Detailed Buying Experience Narratives** | Structured long-form reviews detailing timeline, negotiation outcome, trade-in fairness, and salesperson conduct. |
| **6** | **Verified Review Badges (Evidence Upload)** | Users can optionally upload a redacted Buyer’s Order or Bill of Sale to receive a prominent **"Verified Purchase"** badge. Evidence is private and NEVER shared publicly. |
| **7** | **Authenticated Dealership Responses** | Verified dealership personnel can post official, branded replies to customer feedback. |
| **8** | **Deep Integration with CarMatrix Tools** | Instant cross-linking from Dealer Intel profiles into the Dealer Quote Auditor, State Fee Guide, and VIN Decoder. |
| **9** | **High-Intent Organic Search (SEO)** | Dynamic, crawlable dealership profile pages (e.g. `/dealer-intel/sewell-cadillac-dallas`) targeting searches like *"Sewell Cadillac dealer fees"* or *"Park Place Lexus reviews"*. |
| **10** | **DFW Initial Market & Nationwide Scalability** | Pre-populated with verified DFW franchised and major independent dealers, built on scalable schemas supporting any US city and state. |

---

## 4. Structured Intelligence & Practice Categorization

Generic reviews fail because they lack structured data. Dealer Intel captures concrete, objective transaction attributes:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       DEALER INTEL SCORECARD                            │
├────────────────────────────────┬────────────────────────────────────────┤
│ Overall Consumer Rating        │ ★★★★☆ 4.2 / 5.0 (84 Reviews)           │
├────────────────────────────────┼────────────────────────────────────────┤
│ Advertised Price Honored       │ 78% of buyers reported price honored   │
│ Average Reported Doc Fee       │ $150 (Texas Statutory Benchmark: $150) │
│ Mandatory Add-On Risk          │ LOW (12% report forced accessories)    │
│ F&I Financing Integrity        │ 91% reported agreed APR held in F&I    │
│ Would Buy Again                │ 86% Consumer Recommendation Rate       │
└────────────────────────────────┴────────────────────────────────────────┘
```

### 4.1 Tracked Negative Practice Flags (Consumer Alerts)
* ⚠️ **Advertised Price Markup:** Online price conditioned on undisclosed trade-in requirement or captive financing.
* ⚠️ **Mandatory Dealer Add-Ons:** Non-optional paint protection, VIN etching, LoJack, or nitrogen packs added above MSRP/advertised price.
* ⚠️ **F&I Rate Switchback:** Approved bank rate marked up or terms altered at closing.
* ⚠️ **Excessive Doc Fee:** Dealer documentation fee significantly exceeding state standards (e.g. >$150–$300 in Texas).
* ⚠️ **Trade-In Equity Reduction:** Trade-in valuation slashed upon physical appraisal without mechanical justification.

### 4.2 Tracked Positive Practice Badges (Trust Honors)
* 🛡️ **Transparent Pricing Partner:** Consistently honors online quotes with zero surprise fees.
* 🛡️ **Zero Mandatory Add-Ons:** All protection products, warranties, and accessories are strictly optional.
* 🛡️ **Fair Trade-In Practice:** Matches or exceeds CarMatrix Instant Market Equity valuations.

---

## 5. Trust, Privacy & Legal Architecture

### 5.1 Legal & Defamation Shield (Section 230 Compliance)
* All reviews are user-generated subjective opinions and reports of personal consumer transactions.
* Every review page prominently displays:
  > *"User-generated review. Allegations and fee reports reflect the author's declared personal transaction experience and are not verified statements of fact by CarMatrix."*
* Defamation & Parity Rule: Positive and negative reviews receive identical moderation standards. Dealers cannot pay to remove negative reviews.
* Reviews alleging illegal conduct or naming non-public individuals are flagged for moderator review.

### 5.2 Consumer PII & Evidence Security
* **Private Evidence Bucket:** Uploaded documents (purchase orders, bills of sale, window stickers) are stored in an encrypted, non-public Supabase Storage bucket (`dealer-intel-evidence`).
* **Zero Public Document Exposure:** Uploaded evidence is strictly viewable by authenticated CarMatrix administrators for verification purposes. It is never rendered or accessible via public URLs.
* **Automated Redaction Prompt:** The submission UI instructs consumers to redact social security numbers, banking details, and full residential addresses before uploading.

### 5.3 Dealership Claiming & Representative Verification
* Dealership representatives must authenticate with an email matching the dealership's domain (e.g. `user@classicchevytexas.com`).
* Manual verification by CarMatrix administrator before assigning the `dealer_representative` role.
* Representatives can post official responses, claim their profile, and submit verified fee schedules.

---

## 6. Integration Points with CarMatrix Core

1. **Dealer Quote Auditor Widget (`DealerQuoteAuditorWidget.tsx`):**
   * When an auditor user analyzes a quote from a dealership (e.g. "Metro Auto Toyota"), a link appears: *"Check Metro Auto Toyota on Dealer Intel™"*.
   * If an auditor flags $1,800 in junk fees, they can click: *"Report these fees to Dealer Intel™"*, pre-filling the review form with audited fee data.

2. **State Statutory Fee Guide (`StateFeeGuideWidget.tsx`):**
   * On the Texas state card, add a deep-link: *"Explore 250+ DFW Dealership Doc Fees on Dealer Intel™"*.

3. **Vehicle Listings & Detail Pages (`VehicleDetailPage.tsx`, `VehicleCard.tsx`):**
   * MarketCheck inventory listings already provide `dealer.name`, `dealer.city`, `dealer.state`.
   * Add a Dealer Intel rating pill directly next to the dealer name: e.g. `★ 4.4 Dealer Intel (DFW)`.

---

## 7. Metrics for Success

* **Engagement:** >25% of Dealer Quote Auditor users cross-navigate to Dealer Intel.
* **Organic Search Growth:** Top 3 search ranking for *"dealership name + dealer fees"* across top 50 DFW auto groups.
* **Review Verification Rate:** >35% of submitted reviews backed by uploaded documentation.
* **Dealership Engagement:** >15% of reviewed DFW dealerships claiming profiles to post responses within 90 days of launch.
