'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Sparkles } from 'lucide-react'

// ─── AI Response Map ──────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  { id: 'q1', label: '🤸 Apa itu Kebugaran?', emoji: '🤸' },
  { id: 'q2', label: '💻 Bantu saya koding!', emoji: '💻' },
  { id: 'q3', label: '🗺️ Cara main petanya?', emoji: '🗺️' },
]

const AI_RESPONSES: Record<string, string> = {
  q1: '🌟 Kebugaran Jasmani adalah kemampuan tubuh kita untuk melakukan kegiatan sehari-hari dengan penuh semangat tanpa mudah lelah! Ada 5 komponen penting: kekuatan 💪, daya tahan ❤️, kelenturan 🧘, kecepatan ⚡, dan kelincahan 🐆. Rajin olahraga setiap hari ya!',
  q2: '🤖 Halo Coder Cilik! Coding itu seperti memberikan perintah kepada robot atau komputer. Di game ini, kamu menyusun blok-blok perintah: ▶️ Mulai → 🏃 Gerak Maju → 🦘 Lompat → 🚀 Laksanakan! Klik blok-blok itu secara berurutan ya! Kamu pasti bisa! 🎉',
  q3: '🗺️ Petualangan dimulai dari Dermaga Giri ⚓! Klik pulau yang bersinar ✨, baca materinya, lalu selesaikan tantangan koding untuk membuka pulau berikutnya. Ada 4 pulau yang harus dijelajahi: Dermaga Giri → Tebing Kekuatan → Hutan Sidayu → Peti Emas Bawean! Selamat berpetualang! 🏝️',
}

// ─── Message Types ────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  ts: number
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#a5b4fc',
            animation: 'pjok-typing 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AiMascot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: '👋 Halo, Petualang Cilik! Aku SEGAR, asisten pintarmu! 🤖✨ Aku siap bantu kamu menjelajahi Peta Harta Karun Kebugaran! Mau tanya apa?',
      ts: Date.now(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const addBotMessage = (text: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        { id: `bot-${Date.now()}`, role: 'bot', text, ts: Date.now() },
      ])
    }, 900 + Math.random() * 500)
  }

  const handleQuickReply = (qId: string, label: string) => {
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: label, ts: Date.now() },
    ])
    addBotMessage(AI_RESPONSES[qId])
  }

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue('')
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text, ts: Date.now() },
    ])
    addBotMessage(
      '🤔 Pertanyaan bagus! Aku masih belajar memahami pertanyaan bebas. Coba gunakan tombol cepat di bawah ya! Aku yakin kamu bisa menemukan jawabannya di sana! 💡'
    )
  }

  return (
    <>
      <style>{`
        @keyframes pjok-typing {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30%          { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pjok-chat-in {
          from { opacity: 0; transform: scale(0.9) translateY(16px); transform-origin: bottom right; }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pjok-mascot-idle {
          0%,100% { transform: scale(1) rotate(0deg); }
          25%      { transform: scale(1.05) rotate(-4deg); }
          75%      { transform: scale(1.05) rotate(4deg); }
        }
        @keyframes pjok-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Floating Button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          fontFamily: 'var(--font-nunito, "Nunito", sans-serif)',
        }}
      >
        {/* ── Chat Panel ── */}
        {isOpen && (
          <div
            style={{
              width: '340px',
              height: '480px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, #1e1b4b, #0f172a)',
              border: '1px solid rgba(165,180,252,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'pjok-chat-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>SEGAR AI 🤖</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                  Asisten PJOK Pintarmu
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    animation: 'pjok-msg-in 0.25s ease',
                  }}
                >
                  {msg.role === 'bot' && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: '7px',
                        marginTop: '2px',
                        border: '1.5px solid rgba(165,180,252,0.4)',
                      }}
                    >
                      <Bot size={14} color="#fff" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '9px 13px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                        : 'rgba(255,255,255,0.07)',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      fontWeight: 600,
                      lineHeight: 1.55,
                      border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '7px' }}>
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, border: '1.5px solid rgba(165,180,252,0.4)',
                    }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            <div
              style={{
                padding: '8px 12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', paddingLeft: '2px' }}>
                Tanya Cepat
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUICK_REPLIES.map(qr => (
                  <button
                    key={qr.id}
                    onClick={() => handleQuickReply(qr.id, qr.label)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(165,180,252,0.25)',
                      background: 'rgba(165,180,252,0.08)',
                      color: '#c7d2fe',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background 0.2s, border-color 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(165,180,252,0.18)'
                      e.currentTarget.style.borderColor = 'rgba(165,180,252,0.5)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(165,180,252,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(165,180,252,0.25)'
                    }}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div
              style={{
                padding: '8px 12px 12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                placeholder="Ketik pertanyaanmu..."
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(165,180,252,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                onClick={handleSend}
                aria-label="Kirim pesan"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  boxShadow: '0 4px 14px rgba(124,58,237,0.5)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── FAB Button ── */}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Tutup asisten AI' : 'Buka asisten AI SEGAR'}
          style={{
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            border: '3px solid rgba(165,180,252,0.4)',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(124,58,237,0.6), 0 0 0 6px rgba(124,58,237,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            animation: isOpen ? undefined : 'pjok-mascot-idle 3s ease-in-out infinite',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.7), 0 0 0 8px rgba(124,58,237,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.6), 0 0 0 6px rgba(124,58,237,0.15)' }}
        >
          {isOpen ? <X size={26} /> : <Bot size={26} />}

          {/* Notification dot */}
          {!isOpen && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                background: '#f59e0b',
                borderRadius: '50%',
                border: '2px solid #1e1b4b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={7} color="#fff" />
            </span>
          )}
        </button>
      </div>
    </>
  )
}
