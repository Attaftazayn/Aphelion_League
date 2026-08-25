export default function SessionDetailLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Back Link Skeleton */}
        <div className="skeleton" style={{ width: 100, height: 16 }} />

        {/* Hero Card Skeleton */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div className="skeleton" style={{ width: 80, height: 12 }} />
          <div className="skeleton" style={{ width: 240, height: 28 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="skeleton" style={{ width: 130, height: 16 }} />
            <div className="skeleton" style={{ width: 110, height: 16 }} />
            <div className="skeleton" style={{ width: 120, height: 16 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
          </div>
        </div>

        {/* Participants Pills Skeleton */}
        <div>
          <div className="skeleton" style={{ width: 160, height: 16, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ width: 110, height: 32, borderRadius: 9999 }} />
            ))}
          </div>
        </div>

        {/* Match Pairings Grid Skeleton */}
        <div>
          <div className="skeleton" style={{ width: 200, height: 16, marginBottom: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 14,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: 70, height: 16 }} />
                  <div className="skeleton" style={{ width: 80, height: 20, borderRadius: 9999 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: 70, borderRadius: 10 }} />
                  <div className="skeleton" style={{ width: 30, height: 16 }} />
                  <div className="skeleton" style={{ height: 70, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
