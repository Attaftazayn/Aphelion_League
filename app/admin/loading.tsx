export default function AdminLoading() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 140, height: 28 }} />
          <div className="skeleton" style={{ width: 220, height: 14 }} />
        </div>
        <div className="skeleton" style={{ width: 120, height: 38, borderRadius: 8 }} />
      </div>

      {/* Content Skeleton Card */}
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
        <div className="skeleton" style={{ width: '100%', height: 40, borderRadius: 8 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: 160, height: 16 }} />
            </div>
            <div className="skeleton" style={{ width: 80, height: 16 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
