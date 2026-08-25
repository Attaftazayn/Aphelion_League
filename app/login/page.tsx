'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { TennisBall } from '@/components/ui/icons'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      router.push('/admin/players')
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      setError(
        err?.message?.includes('fetch')
          ? 'Failed to connect to database. Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are added to Vercel Environment Variables.'
          : err?.message || 'Login failed. Please check network connection.'
      )
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg-base)',
      }}
    >
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Aphelion League
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="label">Email address</label>
              <div className="relative">
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 38 }}
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-icon"
                  style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: 'var(--color-danger-dim)',
                  color: 'var(--color-danger)',
                  border: '1px solid rgba(224,82,82,0.25)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-1"
              style={{ height: 44 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
