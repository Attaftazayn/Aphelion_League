'use client'

import { useEffect } from 'react'
import { X, BookOpen, Sparkles, ChevronRight } from 'lucide-react'
import type { MapNode } from './TreasureMap'

interface MaterialModalProps {
  node: MapNode
  isCompleted: boolean
  onClose: () => void
  onUnlock: () => void
}

export default function MaterialModal({ node, isCompleted, onClose, onUnlock }: MaterialModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <style>{`
        @keyframes pjok-modal-in {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pjok-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: 'var(--font-nunito, "Nunito", sans-serif)',
        }}
      >
        {/* Modal Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            animation: 'pjok-modal-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
            background: '#1e1b4b',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${node.color}cc, ${node.color})`,
              padding: '28px 24px 24px',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(0,0,0,0.25)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.25)')}
            >
              <X size={18} />
            </button>

            {/* Emoji */}
            <div
              style={{
                fontSize: '52px',
                lineHeight: 1,
                marginBottom: '10px',
                display: 'inline-block',
                animation: 'pjok-bounce 2.2s ease-in-out infinite',
              }}
            >
              {node.material.emoji}
            </div>

            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
              {node.material.title}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
              Lokasi: {node.name}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BookOpen size={16} color="#a5b4fc" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Materi Pembelajaran
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {node.material.body.map((line, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#e2e8f0',
                    fontWeight: 600,
                    lineHeight: 1.55,
                    borderLeft: `3px solid ${node.color}88`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 24px 24px' }}>
            {isCompleted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(251,191,36,0.15)',
                  border: '1px solid rgba(251,191,36,0.3)',
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                ⭐ Pulau ini sudah berhasil kamu selesaikan!
              </div>
            ) : (
              <button
                onClick={onUnlock}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${node.color}, ${node.color}bb)`,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: `0 6px 24px ${node.glow}`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  letterSpacing: '0.02em',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.03)'
                  e.currentTarget.style.boxShadow = `0 10px 32px ${node.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = `0 6px 24px ${node.glow}`
                }}
              >
                <Sparkles size={18} />
                Buka Pulau Berikutnya!
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
