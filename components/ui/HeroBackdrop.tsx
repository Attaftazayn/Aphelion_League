export function HeroBackdrop() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #161D26 0%, #11151C 55%, var(--bg-base) 100%)',
      }}
    >
      {/* Ambient Tennis Court Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1100px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Tennis Court & Racket Motif SVG Artwork */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.9,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Tennis Racket String Mesh Pattern */}
          <pattern id="racketGrid" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="36" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
            <line x1="0" y1="0" x2="36" y2="0" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background Racket Mesh Texture */}
        <rect width="100%" height="100%" fill="url(#racketGrid)" />

        {/* Perspective Tennis Court Geometry */}
        <g fill="none">
          {/* Outer Court Baseline & Sidelines */}
          <polygon
            points="220,110 1220,110 1350,650 90,650"
            stroke="rgba(16, 185, 129, 0.16)"
            strokeWidth="2"
          />

          {/* Singles Sidelines */}
          <line x1="330" y1="110" x2="240" y2="650" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" />
          <line x1="1110" y1="110" x2="1200" y2="650" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" />

          {/* Service Lines (Top & Bottom) */}
          <line x1="285" y1="270" x2="1155" y2="270" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1.5" />
          <line x1="175" y1="480" x2="1265" y2="480" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1.5" />

          {/* Center Service Line */}
          <line x1="720" y1="270" x2="720" y2="480" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />

          {/* Center Baseline Marks */}
          <line x1="720" y1="110" x2="720" y2="128" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="2" />
          <line x1="720" y1="650" x2="720" y2="632" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="2" />

          {/* Tennis Net Center Line */}
          <line
            x1="140"
            y1="375"
            x2="1300"
            y2="375"
            stroke="rgba(16, 185, 129, 0.22)"
            strokeWidth="2.5"
            strokeDasharray="7 4"
          />
        </g>

        {/* Floating Tennis Ball Curve Seams */}
        <g fill="none" strokeWidth="2">
          {/* Top Left Ball Seam Curve */}
          <path d="M -60,190 Q 140,70 240,310" stroke="rgba(16, 185, 129, 0.12)" />
          <path d="M -30,220 Q 150,110 230,340" stroke="rgba(255, 255, 255, 0.03)" />

          {/* Top Right Ball Seam Curve */}
          <path d="M 1040,70 Q 1240,230 1500,110" stroke="rgba(16, 185, 129, 0.10)" />

          {/* Bottom Right Curves */}
          <path d="M 1120,530 Q 1290,370 1470,590" stroke="rgba(16, 185, 129, 0.08)" />
        </g>

        {/* Abstract Tennis Ball Seam Rings */}
        <circle cx="140" cy="180" r="48" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1.5" strokeDasharray="36 18" />
        <circle cx="1300" cy="240" r="72" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5" strokeDasharray="54 24" />
      </svg>
    </div>
  )
}
