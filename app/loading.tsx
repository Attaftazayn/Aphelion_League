export default function GlobalLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
          <div className="skeleton" style={{ width: 110, height: 20 }} />
          <div className="skeleton" style={{ width: 220, height: 32 }} />
          <div className="skeleton" style={{ width: 300, height: 16 }} />
        </div>

        {/* Hero Grid / Cards Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 120, height: 16 }} />
              <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 9999 }} />
            </div>
            <div className="skeleton" style={{ width: '80%', height: 24 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div className="skeleton" style={{ height: 48, borderRadius: 8 }} />
              <div className="skeleton" style={{ height: 48, borderRadius: 8 }} />
              <div className="skeleton" style={{ height: 48, borderRadius: 8 }} />
            </div>
          </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 100, height: 16 }} />
              <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 9999 }} />
            </div>
            <div className="skeleton" style={{ width: '100%', height: 60, borderRadius: 10 }} />
            <div className="skeleton" style={{ width: '100%', height: 36, borderRadius: 8 }} />
          </div>
        </div>

        {/* List / Table Skeleton Card */}
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
          <div className="skeleton" style={{ width: 180, height: 20 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: 140, height: 16 }} />
                  <div className="skeleton" style={{ width: 90, height: 12 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
