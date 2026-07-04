const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export interface Sport {
  id: string;
  name: string;
}

interface SportsResponse {
  sports: Sport[];
  total: number;
}

export interface MatchTeam {
  name: string;
  badge?: string;
}

export interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  popular?: boolean;
  poster?: string;
  teams: {
    home: MatchTeam;
    away: MatchTeam;
  };
  sources: { source: string; id: string }[];
}

interface MatchesResponse {
  matches: Match[];
  total: number;
}

export async function fetchSports(): Promise<Sport[]> {
  if (!API_BASE) {
    throw new Error('EXPO_PUBLIC_API_BASE is not defined');
  }
  const res = await fetch(`${API_BASE}/sports`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sports: ${res.status}`);
  }
  const data: SportsResponse = await res.json();
  return data.sports;
}

export async function fetchMatchesBySport(sportId: string): Promise<Match[]> {
  if (!API_BASE) {
    throw new Error('EXPO_PUBLIC_API_BASE is not defined');
  }
  const res = await fetch(`${API_BASE}/matches/${sportId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch matches for ${sportId}: ${res.status}`);
  }
  const data: MatchesResponse = await res.json();
  return data.matches;
}

export async function fetchPopularMatchesBySport(sportId: string): Promise<Match[]> {
  if (!API_BASE) {
    throw new Error('EXPO_PUBLIC_API_BASE is not defined');
  }
  const res = await fetch(`${API_BASE}/matches/${sportId}/popular`);
  if (!res.ok) {
    throw new Error(`Failed to fetch popular matches for ${sportId}: ${res.status}`);
  }
  const data: MatchesResponse = await res.json();
  return data.matches;
}

export async function fetchLiveMatches(): Promise<Match[]> {
  if (!API_BASE) {
    throw new Error('EXPO_PUBLIC_API_BASE is not defined');
  }
  const res = await fetch(`${API_BASE}/matches/live`);
  if (!res.ok) {
    throw new Error(`Failed to fetch live matches: ${res.status}`);
  }
  const data: MatchesResponse = await res.json();
  return data.matches;
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
  viewers?: number;
}

const STREAM_SOURCES = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'intel'];

export async function fetchStreams(source: string, sourceId: string): Promise<Stream[]> {
  if (!API_BASE || !STREAM_SOURCES.includes(source)) return [];
  const res = await fetch(`${API_BASE}/stream/${source}/${sourceId}`);
  if (!res.ok) return [];
  return res.json();
}

export function posterUrl(path: string | undefined): string | undefined {
  if (!path || !API_BASE) return undefined;
  return `${API_BASE.replace(/\/api$/, '')}${path}`;
}
