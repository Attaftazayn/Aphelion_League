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
          'linear-gradient(180deg, #222830 0%, #1A1F26 40%, var(--bg-base) 100%)',
      }}
    />
  )
}
