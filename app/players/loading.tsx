export default function PlayersLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 100, height: 18 }} />
          <div className="skeleton" style={{ width: 180, height: 32 }} />
          <div className="skeleton" style={{ width: 240, height: 16 }} />
        </div>

        {/* Search bar skeleton */}
        <div className="skeleton" style={{ width: '100%', maxWidth: 360, height: 42, borderRadius: 10 }} />

        {/* Players Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: 130, height: 16 }} />
                  <div className="skeleton" style={{ width: 80, height: 12 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: 70, height: 28, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
