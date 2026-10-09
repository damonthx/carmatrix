# CarMatrix Project & Agent Guidelines

## 1. Project Overview & Mission
CarMatrix empowers vehicle shoppers with transparent math, hidden-fee detectors, institutional market data, and consumer protection intelligence.
* **Core Brand Tagline:** *"Never Step onto a Dealership Lot Unarmed."*
* **Dealer Intel™ Tagline:** *"Know the dealer before you make the deal."*

---

## 2. Technology Stack & Architecture
* **Frontend:** React 19, TypeScript (~5.8), Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`).
* **Icons & Animation:** `lucide-react`, `motion` / `framer-motion`.
* **Typography:** `font-poppins`.
* **Backend & API:** Express server (`server.ts` bundled with esbuild to `dist/server.cjs`) + Vercel Serverless Functions (`/api/*`).
* **Database & Auth:** Supabase PostgreSQL with Row-Level Security (RLS) and Supabase Auth.
* **Hosting:** Vercel with automatic deployments on Git push to `main`.
* **Third-Party Services:** MarketCheck API (inventory/TCO), NHTSA API (recalls/specs), Bureau of Labor Statistics (CPI indices), Google GenAI (negotiation intelligence).

---

## 3. Design & Styling System
* **Aesthetic:** Modern automotive-tech aesthetic. Dark, charcoal, and black backdrops accented with `#29abe2` (brand blue), emerald (legitimate fees/ratings), amber (caution/negotiable), and rose (red flags/junk fees).
* **Glassmorphism:** Multi-layered frosted glass (`backdrop-blur-2xl`), specular top light rims (`before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent`), dual shadows, and ambient radial glow orbs.
* **Restraint:** Clean, minimal, mobile-first. No gratuitous animations, no excessive cyberpunk styling. High readability and consumer trust are paramount.

---

## 4. Dealer Intel™ Specific Development Rules

When building or modifying Dealer Intel™ features, all agents and contributors MUST adhere to the following rules:

### 4.1 Truth in Data & Trust Integrity
* **Zero Fabricated Reviews:** Never generate, mock, or insert fabricated consumer ratings or reviews in production.
* **Allegations vs. Fact:** Clearly distinguish customer-reported allegations from established facts in the UI. Always label community reports as author-declared transaction experiences.
* **Moderation Parity:** Apply identical moderation standards to positive and negative reviews. Dealerships cannot pay or petition to remove legitimate negative reviews.
* **No Defamatory Assumptions:** Reviews that accuse individuals of illegal conduct or contain hate speech must be queued for administrator review.

### 4.2 PII & Document Security
* **Private Evidence Vault:** All consumer-uploaded transaction documents (buyer orders, bills of sale, window stickers) must be stored in the private Supabase storage bucket (`dealer-intel-evidence`).
* **Zero Public Document Exposure:** Customer evidence files must NEVER be accessible via public URLs or returned in public API queries. Access is restricted strictly to authenticated CarMatrix administrators via time-limited signed URLs.
* **Redaction Guidance:** Review submission forms must explicitly guide users to redact sensitive PII (Social Security Numbers, banking account numbers, residential street addresses) prior to upload.

### 4.3 Server-Side Permission Enforcement
* Never rely on client-side checks for access control or role validation.
* All data operations (review submission, dealership claiming, official responses, moderation status changes) must be secured server-side via Supabase Row-Level Security (RLS) and authenticated sessions.
* Only claimed and verified dealership representatives may post official responses on a dealership profile.

### 4.4 Non-Disruptive Engineering
* Always preserve existing CarMatrix tools and widgets. Do not modify unrelated components during Dealer Intel development.
* Reuse existing design tokens, components, and service utilities (`supabaseClient.js`, `DealerQuoteAuditorWidget`, `StateFeeGuideWidget`) rather than reinventing parallel implementations.
* Maintain initial focus on the Dallas–Fort Worth (DFW) launch market, while ensuring all database schemas, models, and UI filters support nationwide expansion.
