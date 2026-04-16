import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Deliz Beauty Tools - Premium Beauty Essentials in Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  const logoUrl = 'https://delizbeautytools.com/logo1.png';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #171717 0%, #262626 50%, #171717 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #ffffff40, transparent)',
          }}
        />

        {/* Logo */}
        <img
          src={logoUrl}
          alt="Deliz"
          width={420}
          height={120}
          style={{
            filter: 'brightness(0) invert(1)',
            marginBottom: '32px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#d4d4d4',
              letterSpacing: '6px',
              textTransform: 'uppercase',
            }}
          >
            Premium Beauty Essentials
          </div>

          <div
            style={{
              width: '60px',
              height: '2px',
              background: '#737373',
              borderRadius: '1px',
            }}
          />

          <div
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#a3a3a3',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Madina, Accra &bull; Ghana
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#737373',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            delizbeautytools.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
