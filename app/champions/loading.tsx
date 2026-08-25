export default function ChampionsLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 140, height: 18 }} />
          <div className="skeleton" style={{ width: 260, height: 32 }} />
          <div className="skeleton" style={{ width: 200, height: 16 }} />
        </div>

        {/* Big Champion Banner Skeleton */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 16,
            padding: '36px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14 }} />
          <div className="skeleton" style={{ width: 120, height: 20, borderRadius: 9999 }} />
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: 180, height: 26 }} />
          <div style={{ display: 'flex', gap: 24, paddingTop: 14, borderTop: '1px solid var(--border-base)', width: 240, justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: 50, height: 30 }} />
            <div className="skeleton" style={{ width: 50, height: 30 }} />
            <div className="skeleton" style={{ width: 50, height: 30 }} />
          </div>
        </div>

        {/* Hall of Fame Roster Grid Skeleton */}
        <div>
          <div className="skeleton" style={{ width: 220, height: 16, marginBottom: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {[1, 2, 3].map((i) => (
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
                  <div className="skeleton" style={{ width: 42, height: 42, borderRadius: '50%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ width: 90, height: 12 }} />
                    <div className="skeleton" style={{ width: 130, height: 16 }} />
                    <div className="skeleton" style={{ width: 100, height: 12 }} />
                  </div>
                </div>
                <div className="skeleton" style={{ width: 20, height: 20 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
