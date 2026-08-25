export function HeroBackdrop() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 540,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Jejak photo backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/jejakfoto.jpg"
        alt="Jejak Tennis backdrop"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 30%',
          opacity: 0.65,
          filter: 'brightness(0.85) contrast(1.15)',
        }}
      />
      {/* Smooth 3-stop vertical gradient mask fading into #121517 background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(18, 21, 23, 0.20) 0%, rgba(18, 21, 23, 0.65) 55%, var(--bg-base) 100%)',
        }}
      />
    </div>
  )
}
