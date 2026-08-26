'use client'

import { useState } from 'react'
import MaterialModal from './MaterialModal'
import CodingPuzzle from './CodingPuzzle'
import {
  Flame, Zap, Dumbbell, Activity, PersonStanding,
  Heart, Gauge, Scale, StretchHorizontal, Rabbit, Wind, Trophy, Lock, Star,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
export type NodeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface MapNode {
  id: NodeId
  name: string
  subtitle: string
  icon: React.ReactNode
  color: string
  glow: string
  material: {
    title: string
    emoji: string
    body: string[]
  }
  // percentage-based position on the map canvas
  posLeft: string
  posTop: string
}

const MAP_NODES: MapNode[] = [
  {
    id: 1,
    name: 'Pemanasan Statis',
    subtitle: 'Static Warm-up',
    icon: <Flame size={22} strokeWidth={2.5} />,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.55)',
    posLeft: '7%', posTop: '75%',
    material: {
      title: 'Pemanasan Statis',
      emoji: '🔥',
      body: [
        'Pemanasan statis adalah gerakan meregangkan otot dengan menahan posisi selama 10–30 detik.',
        '🎯 Tujuan: meningkatkan kelenturan awal dan menyiapkan sendi sebelum bergerak.',
        '🦵 Contoh: meregangkan otot paha, betis, dan bahu sambil diam di tempat.',
        '⏱️ Lakukan setiap gerakan selama 15–20 detik agar efektif.',
        'Pemanasan statis yang benar membuat tubuhmu lebih siap dan terhindar dari cedera! 💪',
      ],
    },
  },
  {
    id: 2,
    name: 'Pemanasan Dinamis',
    subtitle: 'Dynamic Warm-up',
    icon: <Zap size={22} strokeWidth={2.5} />,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.55)',
    posLeft: '20%', posTop: '60%',
    material: {
      title: 'Pemanasan Dinamis',
      emoji: '⚡',
      body: [
        'Pemanasan dinamis adalah gerakan aktif yang melibatkan seluruh tubuh secara berurutan.',
        '🏃 Contoh: jogging di tempat, high knee, jumping jacks, dan arm circle.',
        '❤️ Manfaat: meningkatkan detak jantung, suhu tubuh, dan aliran darah ke otot.',
        '🔄 Lakukan setiap gerakan 10–15 repetisi sebelum berolahraga inti.',
        'Pemanasan dinamis membuat tubuhmu "terjaga" dan siap untuk bergerak cepat! ⚡',
      ],
    },
  },
  {
    id: 3,
    name: 'Kekuatan Lengan',
    subtitle: 'Push-up',
    icon: <Dumbbell size={22} strokeWidth={2.5} />,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.55)',
    posLeft: '34%', posTop: '70%',
    material: {
      title: 'Kekuatan Lengan — Push-up',
      emoji: '💪',
      body: [
        'Push-up melatih otot dada, bahu, dan trisep secara bersamaan.',
        '📐 Posisi benar: badan lurus seperti papan, tangan selebar bahu, turunkan dada hingga hampir menyentuh lantai.',
        '🔢 Mulai dari 5–8 repetisi, tingkatkan secara bertahap setiap minggu.',
        '⚠️ Hindari mengangkat pantat terlalu tinggi atau membiarkan pinggang turun.',
        'Push-up rutin = lengan kuat dan postur tubuh yang tegap! 🦾',
      ],
    },
  },
  {
    id: 4,
    name: 'Kekuatan Perut',
    subtitle: 'Sit-up',
    icon: <Activity size={22} strokeWidth={2.5} />,
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.55)',
    posLeft: '48%', posTop: '55%',
    material: {
      title: 'Kekuatan Perut — Sit-up',
      emoji: '🔥',
      body: [
        'Sit-up melatih otot perut (core) yang menjadi pusat kekuatan seluruh gerak tubuh.',
        '📐 Posisi benar: berbaring, lutut ditekuk, tangan di dada, angkat tubuh ke arah lutut.',
        '🔢 Targetkan 10–15 repetisi dengan gerakan pelan dan terkontrol.',
        '⚠️ Jangan menarik kepala dengan tangan — biarkan otot perut yang bekerja!',
        'Core yang kuat = keseimbangan tubuh lebih baik dalam setiap olahraga! 🏅',
      ],
    },
  },
  {
    id: 5,
    name: 'Kekuatan Tungkai',
    subtitle: 'Squat',
    icon: <PersonStanding size={22} strokeWidth={2.5} />,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.55)',
    posLeft: '62%', posTop: '68%',
    material: {
      title: 'Kekuatan Tungkai — Squat',
      emoji: '🦵',
      body: [
        'Squat melatih otot paha depan (quadriceps), paha belakang (hamstring), dan bokong (glutes).',
        '📐 Posisi benar: kaki selebar bahu, lutut tidak melebihi ujung jari kaki, punggung tegak.',
        '🔢 Turunkan tubuh seperti "mau duduk di kursi" hingga paha sejajar lantai.',
        '⚠️ Jaga lutut agar tetap menghadap ke depan, tidak miring ke dalam.',
        'Squat adalah "raja" latihan kaki — kaki kuat = lari lebih cepat! 🏆',
      ],
    },
  },
  {
    id: 6,
    name: 'Daya Tahan',
    subtitle: 'Endurance',
    icon: <Heart size={22} strokeWidth={2.5} />,
    color: '#e11d48',
    glow: 'rgba(225,29,72,0.55)',
    posLeft: '76%', posTop: '55%',
    material: {
      title: 'Daya Tahan (Endurance)',
      emoji: '❤️',
      body: [
        'Daya tahan adalah kemampuan tubuh untuk melakukan aktivitas dalam waktu yang lama tanpa kelelahan.',
        '🏃 Latihan: lari jarak jauh (jogging), bersepeda, berenang, atau senam aerobik.',
        '📈 Tingkatkan durasi latihan secara bertahap: mulai 10 menit, tambah 2–3 menit tiap minggu.',
        '❤️ Daya tahan yang baik menjaga kesehatan jantung dan paru-paru.',
        'Anak yang punya daya tahan baik tidak mudah ngos-ngosan saat bermain! 🌬️',
      ],
    },
  },
  {
    id: 7,
    name: 'Kecepatan',
    subtitle: 'Speed',
    icon: <Gauge size={22} strokeWidth={2.5} />,
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.55)',
    posLeft: '88%', posTop: '40%',
    material: {
      title: 'Kecepatan (Speed)',
      emoji: '⚡',
      body: [
        'Kecepatan adalah kemampuan bergerak dari satu titik ke titik lain dalam waktu paling singkat.',
        '🏁 Latihan: sprint 20–40 meter, lari akselerasi, dan latihan reaksi.',
        '🦵 Kecepatan dipengaruhi oleh kekuatan otot kaki dan teknik berlari yang benar.',
        '📐 Saat sprint: condongkan badan ke depan, ayunkan tangan dengan kuat, langkah pendek dan cepat.',
        'Kecepatan bisa dilatih! Semakin sering berlatih, semakin cepat larimu! 🚀',
      ],
    },
  },
  {
    id: 8,
    name: 'Keseimbangan',
    subtitle: 'Balance',
    icon: <Scale size={22} strokeWidth={2.5} />,
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.55)',
    posLeft: '78%', posTop: '22%',
    material: {
      title: 'Keseimbangan (Balance)',
      emoji: '⚖️',
      body: [
        'Keseimbangan adalah kemampuan tubuh untuk menjaga posisi stabil saat diam atau bergerak.',
        '🧘 Latihan: berdiri satu kaki, berjalan di atas garis lurus, dan gerakan yoga dasar.',
        '🧠 Keseimbangan melibatkan kerja sama antara mata, telinga bagian dalam, dan otot.',
        '⏱️ Coba berdiri satu kaki selama 10–30 detik, lalu ganti kaki.',
        'Keseimbangan yang baik mencegah jatuh dan membuat gerakanmu lebih luwes! 🌟',
      ],
    },
  },
  {
    id: 9,
    name: 'Kelenturan',
    subtitle: 'Flexibility',
    icon: <StretchHorizontal size={22} strokeWidth={2.5} />,
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.55)',
    posLeft: '62%', posTop: '10%',
    material: {
      title: 'Kelenturan (Flexibility)',
      emoji: '🤸',
      body: [
        'Kelenturan adalah kemampuan sendi dan otot untuk bergerak dalam rentang gerak yang penuh.',
        '🧘 Latihan: peregangan seluruh tubuh, yoga, dan senam lantai.',
        '🌡️ Lakukan peregangan saat tubuh sudah hangat — jangan saat badan masih dingin!',
        '⏱️ Tahan setiap posisi peregangan 20–30 detik dan bernafaslah dengan rileks.',
        'Tubuh yang lentur bergerak lebih bebas dan jarang mengalami cedera otot! 🌿',
      ],
    },
  },
  {
    id: 10,
    name: 'Kelincahan',
    subtitle: 'Agility',
    icon: <Rabbit size={22} strokeWidth={2.5} />,
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.55)',
    posLeft: '45%', posTop: '18%',
    material: {
      title: 'Kelincahan (Agility)',
      emoji: '🐆',
      body: [
        'Kelincahan adalah kemampuan mengubah arah gerakan tubuh dengan cepat dan tepat.',
        '🏃 Latihan: lari zig-zag, ladder drill, shuttle run, dan cone drill.',
        '🧠 Kelincahan membutuhkan koordinasi yang baik antara otak, mata, dan kaki.',
        '⚡ Sangat penting dalam olahraga tim seperti sepak bola, basket, dan bulu tangkis.',
        'Semakin lincah tubuhmu, semakin mudah kamu menghindari rintangan! 🥷',
      ],
    },
  },
  {
    id: 11,
    name: 'Pendinginan',
    subtitle: 'Cool-down',
    icon: <Wind size={22} strokeWidth={2.5} />,
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.55)',
    posLeft: '27%', posTop: '25%',
    material: {
      title: 'Pendinginan (Cool-down)',
      emoji: '🌬️',
      body: [
        'Pendinginan adalah tahap akhir olahraga untuk mengembalikan tubuh ke kondisi normal secara bertahap.',
        '🚶 Lakukan: berjalan pelan selama 3–5 menit, lalu peregangan ringan seluruh tubuh.',
        '❤️ Pendinginan mencegah pusing, kram otot, dan menurunkan detak jantung perlahan.',
        '😌 Saat pendinginan, fokuslah pada pernapasan — tarik napas dalam dan keluarkan perlahan.',
        'Jangan langsung duduk atau berhenti total setelah olahraga keras! Selalu mendingin dulu! ❄️',
      ],
    },
  },
  {
    id: 12,
    name: 'Kuis Harta Karun',
    subtitle: 'Final Quiz',
    icon: <Trophy size={22} strokeWidth={2.5} />,
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.65)',
    posLeft: '12%', posTop: '15%',
    material: {
      title: '🏆 Kuis Harta Karun — Final!',
      emoji: '🎉',
      body: [
        'LUAR BIASA! Kamu telah menaklukkan semua 12 pulau petualangan kebugaran! 🌟',
        '📋 Recap: Pemanasan → Kekuatan (Lengan, Perut, Tungkai) → Daya Tahan → Kecepatan → Keseimbangan → Kelenturan → Kelincahan → Pendinginan.',
        '🏅 Kebugaran Jasmani = kemampuan tubuh melakukan aktivitas tanpa mudah lelah dengan 5 komponen utama.',
        '🧠 Ingat: Olahraga rutin 3–5× seminggu adalah kunci tubuh sehat dan pikiran cerdas!',
        'Kamu adalah Pahlawan Kebugaran Sejati! Teruslah bergerak aktif setiap hari! 🦸‍♂️🦸‍♀️',
      ],
    },
  },
]

// ─── SVG Connection Lines ─────────────────────────────────────────────────────
// Centers approximate the node button center (posLeft + ~3.5%, posTop + ~4%)
const NODE_CENTERS = [
  { x: 7 + 3.5,  y: 75 + 4 },  // 1
  { x: 20 + 3.5, y: 60 + 4 },  // 2
  { x: 34 + 3.5, y: 70 + 4 },  // 3
  { x: 48 + 3.5, y: 55 + 4 },  // 4
  { x: 62 + 3.5, y: 68 + 4 },  // 5
  { x: 76 + 3.5, y: 55 + 4 },  // 6
  { x: 88 + 3.5, y: 40 + 4 },  // 7
  { x: 78 + 3.5, y: 22 + 4 },  // 8
  { x: 62 + 3.5, y: 10 + 4 },  // 9
  { x: 45 + 3.5, y: 18 + 4 },  // 10
  { x: 27 + 3.5, y: 25 + 4 },  // 11
  { x: 12 + 3.5, y: 15 + 4 },  // 12
]

function ConnectionLines({ unlockedCount }: { unlockedCount: number }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="pjok-glow-line">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {NODE_CENTERS.slice(0, 11).map((from, i) => {
        const to = NODE_CENTERS[i + 1]
        const unlocked = i + 1 < unlockedCount
        return (
          <line
            key={i}
            x1={`${from.x}%`} y1={`${from.y}%`}
            x2={`${to.x}%`}   y2={`${to.y}%`}
            stroke={unlocked ? '#fde68a' : 'rgba(255,255,255,0.18)'}
            strokeWidth={unlocked ? 2.5 : 1.8}
            strokeDasharray={unlocked ? '0' : '8 5'}
            filter={unlocked ? 'url(#pjok-glow-line)' : undefined}
            style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
          />
        )
      })}
    </svg>
  )
}

// ─── Single Node Button ───────────────────────────────────────────────────────
function NodeButton({
  node,
  isUnlocked,
  isCompleted,
  onClick,
}: {
  node: MapNode
  isUnlocked: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: node.posLeft,
        top: node.posTop,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {/* Label chip */}
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          borderRadius: '999px',
          padding: '2px 10px',
          fontSize: '10px',
          fontWeight: 800,
          color: '#fff',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          border: '1px solid rgba(255,255,255,0.12)',
          maxWidth: '120px',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        {node.name}
      </div>

      {/* Circle button */}
      <button
        onClick={isUnlocked ? onClick : undefined}
        disabled={!isUnlocked}
        aria-label={`${node.name} — ${isUnlocked ? 'buka' : 'terkunci'}`}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: isUnlocked ? '3px solid rgba(255,255,255,0.55)' : '2px solid rgba(255,255,255,0.12)',
          background: isUnlocked
            ? `radial-gradient(circle at 35% 35%, ${node.color}cc, ${node.color})`
            : 'rgba(60,60,80,0.5)',
          color: isUnlocked ? '#fff' : 'rgba(255,255,255,0.28)',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: isUnlocked
            ? `0 0 18px ${node.glow}, 0 5px 16px rgba(0,0,0,0.4)`
            : '0 3px 10px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          backdropFilter: 'blur(3px)',
        }}
        onMouseEnter={e => {
          if (isUnlocked) {
            e.currentTarget.style.transform = 'scale(1.14)'
            e.currentTarget.style.boxShadow = `0 0 30px ${node.glow}, 0 8px 24px rgba(0,0,0,0.5)`
          }
        }}
        onMouseLeave={e => {
          if (isUnlocked) {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = `0 0 18px ${node.glow}, 0 5px 16px rgba(0,0,0,0.4)`
          }
        }}
      >
        {isUnlocked
          ? isCompleted
            ? <Star size={26} fill="#fde68a" color="#fde68a" strokeWidth={2} />
            : node.icon
          : <Lock size={22} strokeWidth={2.5} />}

        {/* Pulse ring on active (unlocked, not completed) node */}
        {isUnlocked && !isCompleted && (
          <span
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: `2.5px solid ${node.color}`,
              animation: 'pjok-pulse 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Node number badge */}
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: isUnlocked ? node.color : 'rgba(80,80,100,0.8)',
            border: '2px solid rgba(0,0,0,0.4)',
            fontSize: '9px',
            fontWeight: 900,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {node.id}
        </span>
      </button>

      {/* Subtitle */}
      <div
        style={{
          fontSize: '9px',
          fontWeight: 700,
          color: isUnlocked ? '#fde68a' : 'rgba(255,255,255,0.28)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}
      >
        {node.subtitle}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TreasureMap() {
  const [unlockedCount, setUnlockedCount] = useState<number>(1)
  const [completedNodes, setCompletedNodes] = useState<Set<NodeId>>(new Set())
  const [activeModal, setActiveModal] = useState<NodeId | null>(null)
  const [showCoding, setShowCoding] = useState<NodeId | null>(null)

  const handleNodeClick = (id: NodeId) => setActiveModal(id)
  const handleCloseModal = () => setActiveModal(null)

  const handleOpenCoding = (fromNodeId: NodeId) => {
    setActiveModal(null)
    setShowCoding(fromNodeId)
  }

  const handleUnlockSuccess = (fromNodeId: NodeId) => {
    setCompletedNodes(prev => new Set(prev).add(fromNodeId))
    if (fromNodeId < 12) {
      setUnlockedCount(prev => Math.max(prev, fromNodeId + 1))
    }
    setShowCoding(null)
  }

  const handleCloseCoding = () => setShowCoding(null)

  const activeNode = MAP_NODES.find(n => n.id === activeModal) ?? null
  const codingNode = MAP_NODES.find(n => n.id === showCoding) ?? null

  return (
    <>
      <style>{`
        @keyframes pjok-pulse {
          0%   { transform: scale(1); opacity: 0.8; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pjok-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pjok-wave {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pjok-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .pjok-font { font-family: var(--font-nunito, 'Nunito', sans-serif); }
      `}</style>

      {/* ── Full-screen canvas ── */}
      <div
        className="pjok-font"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 35%, #0284c7 65%, #0ea5e9 100%)',
        }}
      >
        {/* Animated ocean waves */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', opacity: 0.2 }}>
          <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, width: '200%', animation: 'pjok-wave 14s linear infinite' }} preserveAspectRatio="none">
            <path fill="#7dd3fc" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,138.7C840,128,960,160,1080,186.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L0,320Z" />
          </svg>
          <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, width: '200%', animation: 'pjok-wave 20s linear infinite reverse', opacity: 0.5 }} preserveAspectRatio="none">
            <path fill="#bae6fd" d="M0,224L80,213.3C160,203,320,181,480,192C640,203,800,245,960,245.3C1120,245,1280,203,1360,181.3L1440,160L1440,320L0,320Z" />
          </svg>
        </div>

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 41 + 3) % 97}%`,
            top: `${(i * 29 + 5) % 88}%`,
            width: i % 4 === 0 ? '5px' : '3px',
            height: i % 4 === 0 ? '5px' : '3px',
            borderRadius: '50%',
            background: '#fff',
            opacity: 0.3 + (i % 5) * 0.1,
            animation: `pjok-float ${2 + (i % 5) * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.28}s`,
            zIndex: 0,
          }} />
        ))}

        {/* 12 island blobs — one per node */}
        {MAP_NODES.map((node, i) => (
          <div key={node.id} style={{
            position: 'absolute',
            left: node.posLeft,
            top: node.posTop,
            width: 90 + (i % 3) * 18,
            height: 50 + (i % 3) * 10,
            background: `radial-gradient(ellipse at 40% 40%, #86efac, #15803d)`,
            borderRadius: '50% 60% 55% 45% / 50% 55% 45% 60%',
            transform: 'translate(-50%, -50%) scale(1.18)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.32)',
            zIndex: 2,
            animation: `pjok-float ${3 + i * 0.35}s ease-in-out infinite`,
            animationDelay: `${i * 0.45}s`,
            opacity: 0.88,
          }} />
        ))}

        {/* Title Banner */}
        <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '18px',
            padding: '8px 24px',
          }}>
            <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🗺️ Peta Harta Karun</div>
            <div style={{ fontSize: '18px', color: '#fff', fontWeight: 900, lineHeight: 1.2 }}>Kebugaran Jasmani</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: '2px' }}>INOBEL Gresik 2026 · 12 Pulau Petualangan</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '240px', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#fde68a', fontWeight: 700 }}>Petualanganmu</span>
            <span style={{ fontSize: '10px', color: '#fff', fontWeight: 800 }}>{completedNodes.size}/12 Pulau 🏝️</span>
          </div>
          <div style={{ height: '9px', background: 'rgba(0,0,0,0.35)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{
              height: '100%',
              width: `${(completedNodes.size / 12) * 100}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
              borderRadius: '999px',
              backgroundSize: '200% 100%',
              transition: 'width 0.6s ease',
              animation: 'pjok-shimmer 2s linear infinite',
            }} />
          </div>
        </div>

        {/* SVG Connection Lines */}
        <ConnectionLines unlockedCount={unlockedCount} />

        {/* Node Buttons */}
        {MAP_NODES.map(node => (
          <NodeButton
            key={node.id}
            node={node}
            isUnlocked={node.id <= unlockedCount}
            isCompleted={completedNodes.has(node.id)}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
      </div>

      {/* Modals */}
      {activeNode && (
        <MaterialModal
          node={activeNode}
          isCompleted={completedNodes.has(activeNode.id)}
          onClose={handleCloseModal}
          onUnlock={() => handleOpenCoding(activeNode.id)}
        />
      )}
      {codingNode && (
        <CodingPuzzle
          fromNode={codingNode}
          onSuccess={() => handleUnlockSuccess(codingNode.id)}
          onClose={handleCloseCoding}
        />
      )}
    </>
  )
}
