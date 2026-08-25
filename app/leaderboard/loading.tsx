export default function LeaderboardLoading() {
  return (
    <div style={{ minHeight: '80vh', padding: '24px 0', background: 'var(--bg-base)' }}>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 100, height: 18 }} />
          <div className="skeleton" style={{ width: 220, height: 32 }} />
          <div className="skeleton" style={{ width: 280, height: 16 }} />
        </div>

        {/* Podium Skeleton (Top 3 Players) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 14,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: 110, height: 18 }} />
              <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 6 }} />
            </div>
          ))}
        </div>

        {/* Standings Table Skeleton */}
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
          <div className="skeleton" style={{ width: 160, height: 20 }} />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="skeleton" style={{ width: 24, height: 20 }} />
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: 140, height: 16 }} />
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div className="skeleton" style={{ width: 40, height: 16 }} />
                <div className="skeleton" style={{ width: 40, height: 16 }} />
                <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
