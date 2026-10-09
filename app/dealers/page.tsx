'use client';

import React from 'react';
import DealerDirectoryPage from '../../src/DealerDirectoryPage';

/**
 * Next.js (App Router) Page: Dealership Directory (/dealers)
 * Follows Light-Glass design system, server-side data models, and interactive map split-view.
 */
export default function DealersPage() {
  return (
    <DealerDirectoryPage 
      onBackToHome={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
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
