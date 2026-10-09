# Dealer Intel™ Engineering Rules

1. **Brand & Mission Alignment:**
   - CarMatrix tagline: *"Never Step onto a Dealership Lot Unarmed."*
   - Dealer Intel tagline: *"Know the dealer before you make the deal."*
   - Maintain the established automotive-tech glassmorphic visual identity (dark slates, `#29abe2` accents, frosted surfaces, specular lighting rims).

2. **Data & Trust Integrity:**
   - Never fabricate or generate synthetic reviews or ratings in production.
   - Always display consumer reports as author-declared transaction experiences, distinguishing customer allegations from verified facts.
   - Maintain absolute moderation parity between positive and negative feedback.

3. **Privacy & Security:**
   - Uploaded buyer orders and financial evidence MUST reside in the private Supabase storage bucket (`dealer-intel-evidence`).
   - Never expose evidence files or customer PII in public queries or URLs.
   - All permissions, role checks, and access controls must be enforced server-side using Supabase Row-Level Security (RLS).

4. **Architecture & Scope:**
   - Work within the existing React 19 + TypeScript + Vite + Tailwind v4 + Supabase architecture.
   - Do not introduce duplicate frameworks, parallel state managers, or separate backends.
   - Preserve all existing CarMatrix calculators, widgets, and tools without disruption.
   - Focus the initial seed and discovery experience on the Dallas–Fort Worth (DFW) market, built on an architecture that scales nationwide.
