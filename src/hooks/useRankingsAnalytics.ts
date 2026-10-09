import { useCallback } from 'react';
import { ValuationChannel } from '../lib/services/rankingsService';

export type RankingsAnalyticsEvent = 
  | 'rankings_channel_switched'
  | 'price_tier_selected'
  | 'body_type_filtered'
  | 'sort_mode_changed'
  | 'inspection_drawer_viewed'
  | 'inventory_cta_clicked'
  | 'share_rankings_triggered';

export interface RankingsEventPayload {
  channel?: ValuationChannel;
  tier?: string | null;
  bodyType?: string;
  sortBy?: string;
  vehicleId?: string;
  vehicleName?: string;
  price?: number;
  sharePlatform?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Lightweight telemetry & engagement logging hook for CarMatrix Rankings module
 */
export function useRankingsAnalytics() {
  const logEvent = useCallback((event: RankingsAnalyticsEvent, payload: RankingsEventPayload = {}) => {
    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      ...payload,
    };

    // 1. Console debug output in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CarMatrix Telemetry] ${event}:`, eventData);
    }

    // 2. Dispatch custom DOM event for global listeners / analytics layers (Google Tag Manager / GA4)
    if (typeof window !== 'undefined') {
      try {
        const customEvt = new CustomEvent('carmatrix_analytics', { detail: eventData });
        window.dispatchEvent(customEvt);

        // Standard dataLayer push if GTM is loaded
        const win = window as any;
        if (Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event,
            ...eventData,
          });
        }
      } catch (e) {
        // Safe failover
      }
    }
  }, []);

  return { logEvent };
}
