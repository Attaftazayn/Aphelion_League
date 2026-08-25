export function HeroBackdrop() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 520,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Tennis image backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tennis.jpg"
        alt="Tennis backdrop"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          opacity: 0.60,
          filter: 'brightness(0.85) contrast(1.1)',
        }}
      />
      {/* Smooth 3-stop vertical gradient mask fading into #121517 background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(18, 21, 23, 0.25) 0%, rgba(18, 21, 23, 0.65) 55%, var(--bg-base) 100%)',
        }}
      />
    </div>
  )
}
