import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const alt = 'CarMatrix Top-Rated Used Cars by Price Range';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel') || 'private_party';
    const tier = searchParams.get('tier') || 'all';
    const bodyType = searchParams.get('body_type') || 'all';

    // Format human labels
    const channelText = channel === 'dealer_retail' ? 'Dealer Retail' : 'Street Cash';
    const savingsHighlight = channel === 'dealer_retail' ? 'Dealership Inventory' : 'Saves ~15–25% vs Dealerships';

    let tierLabel = 'All Price Brackets';
    if (tier === 'sub-6k') tierLabel = 'Sub-$6,000 Cash';
    else if (tier === '6k-11k') tierLabel = '$6,000 – $11,000 Cash';
    else if (tier === '11k-18k') tierLabel = '$11,000 – $18,000 Cash';
    else if (tier === '18k-26k') tierLabel = '$18,000 – $26,000 Cash';
    else if (tier === '26k-plus') tierLabel = '$26,000+ Cash';

    const categoryText = bodyType !== 'all' ? `${bodyType.toUpperCase()}S` : 'USED VEHICLES';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#020617', // slate-950
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Ambient Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              backgroundColor: 'rgba(41, 171, 226, 0.22)',
              filter: 'blur(100px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              filter: 'blur(100px)',
            }}
          />

          {/* Top Bar: Brand & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#29abe2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontSize: '24px',
                }}
              >
                C
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
                  CarMatrix
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Street Intel Index
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(41, 171, 226, 0.15)',
                border: '1px solid rgba(41, 171, 226, 0.4)',
                color: '#38bdf8',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              {savingsHighlight}
            </div>
          </div>

          {/* Main Headline Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#10b981',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <span>{categoryText}</span>
              <span>•</span>
              <span>{channelText.toUpperCase()} VALUATION</span>
            </div>

            <h1
              style={{
                fontSize: '54px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-1.5px',
              }}
            >
              Top-Rated Used Cars: <span style={{ color: '#29abe2' }}>{tierLabel}</span>
            </h1>

            <p
              style={{
                fontSize: '20px',
                color: '#cbd5e1',
                maxWidth: '920px',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Ranked by mechanical reliability (NHTSA records), 5-year maintenance cost, and true street-clearing cash value.
            </p>
          </div>

          {/* Bottom Bar: Value Metrics & Disclosure */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Scoring Engine</span>
                <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: 800 }}>100-Point Algorithmic</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Data Coverage</span>
                <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: 800 }}>Clean Title Baselines</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Consumer Protection</span>
                <span style={{ fontSize: '18px', color: '#10b981', fontWeight: 800 }}>0% Junk Fee Markup</span>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              carmatrix.online/rankings
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (err) {
    console.error('OG Image generation error:', err);
    // Minimal fallback image
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', color: '#fff', padding: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800 }}>
          CarMatrix | Top-Rated Used Cars
        </div>
      ),
      { ...size }
    );
  }
}
