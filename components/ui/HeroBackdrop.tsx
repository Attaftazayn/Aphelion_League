export function HeroBackdrop() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 600,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, #1E2530 0%, #151A22 45%, var(--bg-base) 100%)',
      }}
    />
  )
}
