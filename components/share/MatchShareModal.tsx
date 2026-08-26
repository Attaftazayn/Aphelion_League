'use client'

import { useRef, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { X, Share2, Download, Loader2, Sparkles } from 'lucide-react'
import type { MatchWithPlayers, Player } from '@/lib/types'

interface MatchShareModalProps {
  match: MatchWithPlayers
  sessionName?: string
  sessionDate?: string
  sessionLocation?: string
  onClose: () => void
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function PlayerAvatar({ player, size = 52 }: { player?: Player; size?: number }) {
  const name = player?.name ?? 'Player'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (player?.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={player.avatar_url}
        alt={name}
        crossOrigin="anonymous"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--accent)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
        border: '2px solid var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.36,
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      }}
    >
      {initials}
    </div>
  )
}

function formatDateIndo(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function MatchShareModal({
  match,
  sessionName,
  sessionDate,
  sessionLocation,
  onClose,
}: MatchShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const teamA = match.match_players?.filter((mp) => mp.team === 'A') ?? []
  const teamB = match.match_players?.filter((mp) => mp.team === 'B') ?? []

  const isCompleted = match.status === 'completed' && match.score_a !== null && match.score_b !== null
  const scoreA = match.score_a ?? 0
  const scoreB = match.score_b ?? 0

  const isWinnerA = isCompleted && scoreA > scoreB
  const isWinnerB = isCompleted && scoreB > scoreA

  const loserScore = isCompleted ? Math.min(scoreA, scoreB) : 0
  const winPts = 7 - loserScore
  const losePts = loserScore

  const formattedDate = formatDateIndo(sessionDate || match.session?.date)
  const locationText = sessionLocation || match.session?.location || 'Aphelion Court'
  const titleText = sessionName || match.session?.name || 'League Session'

  async function generateBlob(): Promise<Blob | null> {
    if (!cardRef.current) return null
    return await toBlob(cardRef.current, {
      quality: 0.98,
      pixelRatio: 3, // High DPI rendering for crisp 1080x1920 Story export
      cacheBust: true,
    })
  }

  async function handleShare() {
    setIsProcessing(true)
    setStatusMsg('Generating high-res card...')
    try {
      const blob = await generateBlob()
      if (!blob) throw new Error('Could not generate image blob')

      const fileName = `aphelion-match-${match.match_number}-result.png`
      const file = new File([blob], fileName, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Aphelion League Match Result',
          text: `Match #${match.match_number} Result: ${scoreA} - ${scoreB}! Check out Aphelion League.`,
          files: [file],
        })
        setStatusMsg('Shared successfully!')
      } else {
        await handleDownload()
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Sharing failed, falling back to download:', err)
        await handleDownload()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleDownload() {
    setIsProcessing(true)
    setStatusMsg('Generating image for download...')
    try {
      if (!cardRef.current) return
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 3,
        cacheBust: true,
      })

      const link = document.createElement('a')
      link.download = `aphelion-match-${match.match_number}-result.png`
      link.href = dataUrl
      link.click()

      setStatusMsg('Image downloaded successfully!')
    } catch (err) {
      console.error('Failed to download image:', err)
      setStatusMsg('Failed to download image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        background: 'rgba(0, 0, 0, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 460,
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 22,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
              Match Result Share Card
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Preview Area (Fixed padding & overflow so card never clips footer) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: '#030604',
          }}
        >
          {/* ─────────────────────────────────────────────────────────────
              THE 9:16 INSTAGRAM STORY SHARE CARD (DOM Element to export)
              Target aspect ratio: 9:16 (360px x 640px)
             ───────────────────────────────────────────────────────────── */}
          <div
            ref={cardRef}
            style={{
              width: 360,
              height: 640,
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              background: '#060C09',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 24px',
              color: '#ffffff',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxSizing: 'border-box',
              flexShrink: 0,
              margin: 'auto 0',
            }}
          >
            {/* Background Tennis Court Vector Artwork & Lighting */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
              {/* Radial Emerald Court Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 380,
                  height: 380,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 12, 9, 0) 70%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  width: 320,
                  height: 320,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(6, 12, 9, 0) 70%)',
                }}
              />

              {/* Vector Perspective Court & Seam Curves */}
              <svg width="100%" height="100%" viewBox="0 0 360 640" style={{ opacity: 0.25 }}>
                <defs>
                  <pattern id="cardGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cardGrid)" />

                {/* Court Outline */}
                <rect x="25" y="60" width="310" height="520" fill="none" stroke="#10B981" strokeWidth="1.5" rx="6" />
                <line x1="25" y1="320" x2="335" y2="320" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6,4" />
                <line x1="180" y1="140" x2="180" y2="500" stroke="#10B981" strokeWidth="1.2" />

                {/* Curved Tennis Ball Seams */}
                <path d="M -20 180 Q 90 280 -20 380" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />
                <path d="M 380 260 Q 270 360 380 460" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />
              </svg>
            </div>

            {/* Card Content Layer */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              
              {/* Header: Branding & Date */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/aphelion.jpeg"
                    alt="Aphelion"
                    style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', border: '1px solid rgba(16, 185, 129, 0.5)' }}
                  />
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                    }}
                  >
                    APHELION LEAGUE
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#10B981',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>Match #{match.match_number}</span>
                  <span>•</span>
                  <span>{titleText}</span>
                </div>

                {formattedDate && (
                  <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                    {formattedDate} • {locationText}
                  </span>
                )}
              </div>

              {/* Main Scoreboard Display */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 16px',
                  borderRadius: 20,
                  background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 12, 9, 0.8) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  margin: '12px 0',
                }}
              >
                {/* Status Badge */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#10B981',
                    marginBottom: 8,
                    background: 'rgba(16, 185, 129, 0.18)',
                    padding: '3px 10px',
                    borderRadius: 6,
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {isCompleted ? 'FINAL MATCH RESULT' : 'SCHEDULED MATCH'}
                </span>

                {/* Score Big Display */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    margin: '6px 0',
                  }}
                >
                  <span
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      color: isWinnerA ? '#10B981' : '#ffffff',
                      lineHeight: 1,
                      letterSpacing: '-2px',
                      textShadow: isWinnerA ? '0 0 20px rgba(16, 185, 129, 0.6)' : 'none',
                    }}
                  >
                    {scoreA}
                  </span>

                  <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255, 255, 255, 0.3)' }}>
                    —
                  </span>

                  <span
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      color: isWinnerB ? '#10B981' : '#ffffff',
                      lineHeight: 1,
                      letterSpacing: '-2px',
                      textShadow: isWinnerB ? '0 0 20px rgba(16, 185, 129, 0.6)' : 'none',
                    }}
                  >
                    {scoreB}
                  </span>
                </div>

                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Race to 4 • Doubles Match
                </span>
              </div>

              {/* Team 1 vs Team 2 Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Team A Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: isWinnerA ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isWinnerA ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Overlapping Avatars */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PlayerAvatar player={teamA[0]?.players} size={42} />
                      {teamA[1] && (
                        <div style={{ marginLeft: -14 }}>
                          <PlayerAvatar player={teamA[1]?.players} size={42} />
                        </div>
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: isWinnerA ? '#10B981' : 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.06em' }}>
                        TEAM A {isWinnerA && '• WINNER'}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginTop: 1, lineHeight: 1.2 }}>
                        {teamA.map((mp) => mp.players?.name).filter(Boolean).join(' & ') || 'Team A Players'}
                      </p>
                    </div>
                  </div>

                  {isCompleted && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: isWinnerA ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                        color: isWinnerA ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                        boxShadow: isWinnerA ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                    >
                      +{isWinnerA ? winPts : losePts} PTS
                    </span>
                  )}
                </div>

                {/* Team B Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: isWinnerB ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isWinnerB ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Overlapping Avatars */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PlayerAvatar player={teamB[0]?.players} size={42} />
                      {teamB[1] && (
                        <div style={{ marginLeft: -14 }}>
                          <PlayerAvatar player={teamB[1]?.players} size={42} />
                        </div>
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: isWinnerB ? '#10B981' : 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.06em' }}>
                        TEAM B {isWinnerB && '• WINNER'}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginTop: 1, lineHeight: 1.2 }}>
                        {teamB.map((mp) => mp.players?.name).filter(Boolean).join(' & ') || 'Team B Players'}
                      </p>
                    </div>
                  </div>

                  {isCompleted && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: isWinnerB ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                        color: isWinnerB ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                        boxShadow: isWinnerB ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                    >
                      +{isWinnerB ? winPts : losePts} PTS
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Branding Watermark */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: '1px stroke rgba(16, 185, 129, 0.2)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.08em',
                }}
              >
                <span>🎾 aphelionleague.com</span>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Action Controls Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'var(--bg-surface)',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          {statusMsg && (
            <p style={{ fontSize: 12, textAlign: 'center', color: 'var(--accent)', fontWeight: 700 }}>
              {statusMsg}
            </p>
          )}

          {/* Large Prominent Share Button with IG & WA Logos */}
          <button
            onClick={handleShare}
            disabled={isProcessing}
            className="btn btn-primary"
            style={{
              width: '100%',
              minHeight: 52,
              fontSize: 15,
              fontWeight: 800,
              gap: 10,
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: 14,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              border: 'none',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Share2 size={20} />
                <span>Share This Match Result</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginLeft: 6,
                    paddingLeft: 10,
                    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <InstagramIcon size={18} />
                  <WhatsAppIcon size={18} />
                </div>
              </>
            )}
          </button>

          {/* Secondary PNG Download Button */}
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="btn btn-secondary"
            style={{
              width: '100%',
              minHeight: 42,
              fontSize: 13,
              fontWeight: 700,
              gap: 8,
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download Image (.PNG)
          </button>
        </div>

      </div>
    </div>
  )
}

