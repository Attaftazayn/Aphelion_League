// Database types matching the Supabase schema

export type PlayerStatus = 'active' | 'inactive'
export type MatchStatus = 'upcoming' | 'completed'
export type Team = 'A' | 'B'

export interface Player {
  id: string
  name: string
  avatar_url: string | null
  created_at: string
}

export interface Session {
  id: string
  name: string
  date: string           // ISO date string: "YYYY-MM-DD"
  start_time: string     // "HH:MM:SS"
  end_time: string       // "HH:MM:SS"
  location: string
  created_at: string
}

export interface SessionPlayer {
  id: string
  session_id: string
  player_id: string
  created_at: string
}

export interface Match {
  id: string
  session_id: string
  match_number: number
  status: MatchStatus
  score_a: number | null
  score_b: number | null
  created_at: string
}

export interface MatchPlayer {
  id: string
  match_id: string
  player_id: string
  team: Team
  created_at: string
}

export interface MonthlyChampion {
  id: string
  month_key: string // "YYYY-MM"
  player_id: string
  total_points: number
  wins: number
  win_rate: number
  confirmed_at: string
  player?: Player
}

// Enriched types with joined data

export interface SessionWithPlayers extends Session {
  session_players: (SessionPlayer & { players: Player })[]
}

export interface MatchWithPlayers extends Match {
  match_players: (MatchPlayer & { players: Player })[]
  session?: Session
}

export interface SessionDetail extends Session {
  session_players: (SessionPlayer & { players: Player })[]
  matches: MatchWithPlayers[]
}

// Leaderboard Stats

export interface PlayerStats {
  rank: number
  player: Player
  matches_played: number
  wins: number
  losses: number
  total_points: number
  win_rate: number // ratio 0 to 1
}

// Player Profile Advanced Stats

export interface PlayerRecentMatch {
  match_id: string
  session_name: string
  date: string
  outcome: 'W' | 'L'
  score_display: string // "4-2"
  partner?: Player
  opponents: Player[]
}

export interface PlayerProfileDetails {
  player: Player
  rank: number
  total_points: number
  matches_played: number
  wins: number
  losses: number
  win_rate: number
  current_streak: number
  best_streak: number
  favorite_partner?: { player: Player; matches_together: number; win_rate: number }
  toughest_opponent?: { player: Player; matches_against: number; win_rate: number }
  recent_matches: PlayerRecentMatch[]
}

export type LeaderboardFilterMode = 'overall' | 'session' | 'month'

export interface LeaderboardFilterOptions {
  mode: LeaderboardFilterMode
  sessionId?: string
  monthKey?: string // e.g. "2026-05"
}
