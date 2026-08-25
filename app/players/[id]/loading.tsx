export default function PlayerProfileLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="skeleton" style={{ width: 100, height: 16 }} />

        {/* Profile Card Skeleton */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: 180, height: 26 }} />
          <div className="skeleton" style={{ width: 120, height: 14 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%', maxWidth: 440, marginTop: 8 }}>
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
          </div>
        </div>

        {/* Match History List Skeleton */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div className="skeleton" style={{ width: 160, height: 18 }} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: 50, borderRadius: 10 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
