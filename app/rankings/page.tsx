'use client';

import React from 'react';
import RankingsPage from '../../src/RankingsPage';

/**
 * Next.js App Router Page: Top-Rated Used Cars by Price Range (/rankings)
 */
export default function Page() {
  return (
    <RankingsPage
      onBackToHome={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }}
      onSearchInventory={(make, model) => {
        if (typeof window !== 'undefined') {
          window.location.href = `/?tab=inventory&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
        }
      }}
    />
  );
}
