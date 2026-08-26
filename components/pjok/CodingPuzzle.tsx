'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import type { MapNode } from './TreasureMap'

// ─── Block definitions ────────────────────────────────────────────────────────
interface Block {
  id: string
  label: string
  emoji: string
  color: string
  border: string
  textColor: string
}

const BLOCKS: Block[] = [
  { id: 'start',    label: 'Mulai',       emoji: '▶️',  color: '#16a34a', border: '#15803d', textColor: '#fff' },
  { id: 'move',     label: 'Gerak Maju',  emoji: '🏃',  color: '#2563eb', border: '#1d4ed8', textColor: '#fff' },
  { id: 'jump',     label: 'Lompat!',     emoji: '🦘',  color: '#d97706', border: '#b45309', textColor: '#fff' },
  { id: 'execute',  label: 'Laksanakan!', emoji: '🚀',  color: '#7c3aed', border: '#6d28d9', textColor: '#fff' },
]

const CORRECT_SEQUENCE = ['start', 'move', 'jump', 'execute']

// ─── Types ────────────────────────────────────────────────────────────────────
type PuzzleState = 'idle' | 'success' | 'error'

interface CodingPuzzleProps {
  fromNode: MapNode
  onSuccess: () => void
  onClose: () => void
}

export default function CodingPuzzle({ fromNode, onSuccess, onClose }: CodingPuzzleProps) {
  const [sequence, setSequence] = useState<string[]>([])
  const [state, setPuzzleState] = useState<PuzzleState>('idle')
  const [errorIndex, setErrorIndex] = useState<number | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleBlockClick = (blockId: string) => {
    if (state !== 'idle') return

    const nextIndex = sequence.length
    const expected = CORRECT_SEQUENCE[nextIndex]

    if (blockId !== expected) {
      setErrorIndex(nextIndex)
      setPuzzleState('error')
      setTimeout(() => {
        setSequence([])
        setErrorIndex(null)
        setPuzzleState('idle')
      }, 1400)
      return
    }

    const newSeq = [...sequence, blockId]
    setSequence(newSeq)

    if (newSeq.length === CORRECT_SEQUENCE.length) {
      setPuzzleState('success')
      setTimeout(() => {
        onSuccess()
      }, 1600)
    }
  }

  const handleReset = () => {
    setSequence([])
    setPuzzleState('idle')
    setErrorIndex(null)
  }

  const currentExpected = state === 'idle' ? CORRECT_SEQUENCE[sequence.length] : null

  return (
    <>
      <style>{`
        @keyframes pjok-coding-in {
          from { opacity: 0; transform: scale(0.9) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pjok-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-6px); }
          80%     { transform: translateX(6px); }
        }
        @keyframes pjok-success-pop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pjok-block-press {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.93); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,10,0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: 'var(--font-nunito, "Nunito", sans-serif)',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, #1e1b4b, #0f172a)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            animation: 'pjok-coding-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px' }}>🧩</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Tantangan Coding
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff' }}>
                Susun Blok Programnya!
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
                Klik blok dalam urutan yang benar untuk membuka pulau berikutnya.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Hint */}
          <div style={{ padding: '14px 24px 0' }}>
            <div
              style={{
                background: 'rgba(165,180,252,0.08)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#c7d2fe',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>💡</span>
              Urutan benar:{' '}
              {CORRECT_SEQUENCE.map((id, i) => {
                const b = BLOCKS.find(bl => bl.id === id)!
                return (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{
                      background: b.color,
                      color: b.textColor,
                      borderRadius: '6px',
                      padding: '1px 7px',
                      fontSize: '12px',
                      fontWeight: 800,
                    }}>
                      {b.emoji} {b.label}
                    </span>
                    {i < CORRECT_SEQUENCE.length - 1 && <span style={{ color: '#64748b' }}>→</span>}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Sequence Track */}
          <div style={{ padding: '18px 24px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Susunan Kamu
            </div>
            <div
              style={{
                minHeight: '56px',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: '14px',
                border: `2px dashed ${state === 'error' ? '#ef4444' : state === 'success' ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                transition: 'border-color 0.3s',
                animation: state === 'error' ? 'pjok-shake 0.5s ease' : undefined,
              }}
            >
              {sequence.length === 0 && state === 'idle' && (
                <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>
                  Klik blok di bawah untuk mulai...
                </span>
              )}
              {sequence.map((id, i) => {
                const b = BLOCKS.find(bl => bl.id === id)!
                return (
                  <div
                    key={`${id}-${i}`}
                    style={{
                      background: b.color,
                      border: `2px solid ${b.border}`,
                      borderRadius: '10px',
                      padding: '5px 12px',
                      color: b.textColor,
                      fontSize: '13px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      animation: 'pjok-block-press 0.25s ease',
                    }}
                  >
                    {b.emoji} {b.label}
                  </div>
                )
              })}
              {state === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: 800, fontSize: '13px' }}>
                  <AlertCircle size={16} />
                  Urutan salah! Coba lagi...
                </div>
              )}
              {state === 'success' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#4ade80',
                    fontWeight: 900,
                    fontSize: '14px',
                    animation: 'pjok-success-pop 0.5s ease',
                  }}
                >
                  <CheckCircle size={18} />
                  Berhasil! Membuka pulau... 🎉
                </div>
              )}
            </div>
          </div>

          {/* Block Palette */}
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Blok Program
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {BLOCKS.map(block => {
                const isDone = sequence.includes(block.id) && state !== 'error'
                const isNext = currentExpected === block.id
                return (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    disabled={isDone || state !== 'idle'}
                    aria-label={`Blok ${block.label}`}
                    style={{
                      background: isDone ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${block.color}ee, ${block.color})`,
                      border: isNext
                        ? `3px solid #fff`
                        : isDone
                        ? '2px solid rgba(255,255,255,0.08)'
                        : `2px solid ${block.border}`,
                      borderRadius: '14px',
                      padding: '14px 10px',
                      color: isDone ? '#475569' : block.textColor,
                      fontSize: '15px',
                      fontWeight: 900,
                      cursor: isDone || state !== 'idle' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      position: 'relative',
                      transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.3s',
                      opacity: isDone ? 0.35 : 1,
                      boxShadow: isNext
                        ? `0 0 20px ${block.color}99, 0 4px 12px rgba(0,0,0,0.3)`
                        : '0 4px 12px rgba(0,0,0,0.3)',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      if (!isDone && state === 'idle') {
                        e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)'
                        e.currentTarget.style.boxShadow = `0 8px 24px ${block.color}88`
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isDone && state === 'idle') {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)'
                        e.currentTarget.style.boxShadow = isNext
                          ? `0 0 20px ${block.color}99, 0 4px 12px rgba(0,0,0,0.3)`
                          : '0 4px 12px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    {/* Scratch-style notch top */}
                    <span style={{ fontSize: '20px' }}>{block.emoji}</span>
                    <span>{block.label}</span>
                    {/* Scratch puzzle tab */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '18px',
                        width: '20px',
                        height: '6px',
                        background: isDone ? 'rgba(255,255,255,0.08)' : block.color,
                        borderRadius: '4px 4px 0 0',
                        border: `1px solid ${isDone ? 'rgba(255,255,255,0.05)' : block.border}`,
                        borderBottom: 'none',
                      }}
                    />
                    {isNext && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '50%',
                          transform: 'translateX(50%)',
                          fontSize: '14px',
                          animation: 'pjok-bounce 1s ease-in-out infinite',
                          pointerEvents: 'none',
                        }}
                      >
                        👇
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Reset */}
            {sequence.length > 0 && state === 'idle' && (
              <button
                onClick={handleReset}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94a3b8',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.2s, color 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
              >
                <RotateCcw size={14} />
                Ulangi dari awal
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
