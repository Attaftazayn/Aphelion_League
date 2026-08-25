import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
