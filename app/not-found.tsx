import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="text-center">
        <p className="text-8xl font-black mb-4" style={{ color: 'var(--accent)' }}>
          404
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
