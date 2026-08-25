'use client'

import { useState, useTransition } from 'react'
import type { Player } from '@/lib/types'
import { createPlayer, updatePlayer, deletePlayer } from './actions'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  UserRound,
  Search,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react'

/* ============================================================
   Avatar Component
   ============================================================ */
function PlayerAvatar({ player, size = 36 }: { player: Player; size?: number }) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (player.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={player.avatar_url}
        alt={player.name}
        className="avatar"
        style={{ width: size, height: size }}
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size > 40 ? 18 : 13 }}
    >
      {initials || <UserRound size={16} />}
    </div>
  )
}

/* ============================================================
   Image Compression Helper
   ============================================================ */
function compressProfileImage(file: File, callback: (dataUrl: string) => void, onError: (msg: string) => void) {
  if (!file.type.startsWith('image/')) {
    onError('Please select a valid image file (JPG, PNG, WEBP).')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_SIZE = 400
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width)
          width = MAX_SIZE
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height)
          height = MAX_SIZE
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        callback(compressedDataUrl)
      } else {
        callback(e.target?.result as string)
      }
    }
    img.onerror = () => onError('Failed to load image file.')
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

/* ============================================================
   Player Modal Form
   ============================================================ */
function PlayerModal({
  player,
  onClose,
}: {
  player?: Player
  onClose: () => void
}) {
  const isEditing = !!player
  const [isPending, startTransition] = useTransition()
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(player?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(player?.avatar_url ?? '')
  const [showUrlInput, setShowUrlInput] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressing(true)
    setError(null)

    compressProfileImage(
      file,
      (dataUrl) => {
        setAvatarUrl(dataUrl)
        setIsCompressing(false)
      },
      (errMsg) => {
        setError(errMsg)
        setIsCompressing(false)
      }
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.set('name', name)
    formData.set('avatar_url', avatarUrl)

    startTransition(async () => {
      const result = isEditing
        ? await updatePlayer(player.id, formData)
        : await createPlayer(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Player' : 'Add Player'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Live Profile Photo Preview & Upload Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: '20px 16px',
                borderRadius: 14,
                background: 'var(--bg-raised)',
                border: '1px dashed var(--border-strong)',
                textAlign: 'center',
              }}
            >
              <PlayerAvatar player={{ ...player, name: name || 'Player', avatar_url: avatarUrl || null } as Player} size={64} />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <label
                  className="btn btn-primary btn-sm"
                  style={{ cursor: isCompressing ? 'not-allowed' : 'pointer', gap: 6 }}
                >
                  {isCompressing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {avatarUrl ? 'Ganti Foto Profil' : 'Unggah Foto Profil'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isCompressing}
                    style={{ display: 'none' }}
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, color: 'var(--danger)', height: 26 }}
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="player-name" className="label">
                Nama Lengkap <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="player-name"
                type="text"
                className="input"
                placeholder="misal: Aldo Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                maxLength={80}
              />
            </div>

            {/* Optional URL Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showUrlInput ? 'Sembunyikan Input Link Foto' : 'Atau tempel link URL foto...'}
              </button>

              {showUrlInput && (
                <div style={{ marginTop: 8 }}>
                  <input
                    id="player-avatar"
                    type="url"
                    className="input"
                    placeholder="https://example.com/photo.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--danger-dim)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                }}
              >
                <AlertTriangle size={15} />
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                'Simpan Perubahan'
              ) : (
                'Tambah Pemain'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Delete Confirmation Modal
   ============================================================ */
function DeleteModal({
  player,
  onClose,
}: {
  player: Player
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePlayer(player.id)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Hapus Pemain
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--danger-dim)',
                color: 'var(--danger)',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                Hapus &quot;{player.name}&quot;?
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Pemain ini akan dihapus dari semua sesi pertandingan. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                background: 'var(--danger-dim)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
              }}
            >
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Batal
          </button>
          <button onClick={handleDelete} disabled={isPending} className="btn btn-danger">
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Hapus Pemain
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Main Players Client Component
   ============================================================ */
export function PlayersClient({ players }: { players: Player[] }) {
  const [modal, setModal] = useState<
    | { type: 'create' }
    | { type: 'edit'; player: Player }
    | { type: 'delete'; player: Player }
    | null
  >(null)
  const [search, setSearch] = useState('')

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Pemain</h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 9999,
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-secondary)',
              }}
            >
              {players.length}
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Kelola daftar pemain dan profil liga
          </p>
        </div>
        <button
          id="add-player-btn"
          onClick={() => setModal({ type: 'create' })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Tambah Pemain
        </button>
      </div>

      {/* Main Content Card */}
      {players.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--bg-raised)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <UserRound size={24} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Belum ada pemain yang terdaftar</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Tambahkan pemain untuk memulai.</p>
          </div>
          <button onClick={() => setModal({ type: 'create' })} className="btn btn-primary btn-sm">
            <Plus size={15} />
            Tambah Pemain
          </button>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Card Search Bar */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--bg-surface)',
            }}
          >
            <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search players by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 13,
                width: '100%',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ padding: '36px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No players match &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 16 }}>Player</th>
                    <th>Joined Date</th>
                    <th style={{ width: 100, textAlign: 'right', paddingRight: 16 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((player) => (
                    <tr key={player.id}>
                      <td style={{ paddingLeft: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <PlayerAvatar player={player} size={36} />
                          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                            {player.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {new Date(player.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ paddingRight: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <button
                            id={`edit-player-${player.id}`}
                            onClick={() => setModal({ type: 'edit', player })}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit player"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            id={`delete-player-${player.id}`}
                            onClick={() => setModal({ type: 'delete', player })}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Delete player"
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'create' && (
        <PlayerModal onClose={() => setModal(null)} />
      )}
      {modal?.type === 'edit' && (
        <PlayerModal player={modal.player} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal player={modal.player} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
