'use client';

import React, { use } from 'react';
import DealerProfilePage from '../../../src/DealerProfilePage';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Next.js (App Router) Dynamic Page: /dealers/[slug]
 * Dealership Profile Hub with live inventory, fee transparency audit, and direct lead routing.
 */
export default function DealerSlugPage({ params }: PageProps) {
  // Support both React 19 Promise params (Next.js 15) and object params
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams?.slug || '';

  return (
    <DealerProfilePage
      slug={slug}
      onBack={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dealers';
        }
      }}
      onAuditQuote={(dealerName) => {
        if (typeof window !== 'undefined') {
          window.location.href = `/?quote-auditor=true&dealer=${encodeURIComponent(dealerName)}`;
        }
      }}
    />
  );
}
