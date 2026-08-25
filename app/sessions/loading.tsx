export default function SessionsLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 120, height: 18 }} />
          <div className="skeleton" style={{ width: 200, height: 32 }} />
          <div className="skeleton" style={{ width: 260, height: 16 }} />
        </div>

        {/* Sessions Cards Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div className="skeleton" style={{ width: '70%', height: 20 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <div className="skeleton" style={{ width: 110, height: 14 }} />
                <div className="skeleton" style={{ width: 90, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 140, height: 14 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                <div className="skeleton" style={{ width: 80, height: 14 }} />
                <div className="skeleton" style={{ width: 120, height: 32, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
