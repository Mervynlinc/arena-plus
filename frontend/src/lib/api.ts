import { ApiError, logInternalError, type ApiErrorCode } from "./apiError";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;
const REQUEST_TIMEOUT_MS = 8000;

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
  minute?: string;
  homeScore?: number;
  awayScore?: number;
  league?: string;
}

interface MatchesResponse {
  matches: Match[];
  total: number;
}

async function request<T>(path: string, code: ApiErrorCode): Promise<T> {
  if (!API_BASE) throw new ApiError("CONFIG_MISSING");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new ApiError(code, res.status);
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logInternalError(err, path);
    throw new ApiError("OFFLINE");
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSports(): Promise<Sport[]> {
  const data = await request<SportsResponse>("/sports", "SPORTS_UNAVAILABLE");
  return data.sports;
}

export async function fetchMatchesBySport(sportId: string): Promise<Match[]> {
  const data = await request<MatchesResponse>(
    `/matches/${encodeURIComponent(sportId)}`,
    "MATCHES_UNAVAILABLE"
  );
  return data.matches;
}

export async function fetchPopularMatchesBySport(sportId: string): Promise<Match[]> {
  const data = await request<MatchesResponse>(
    `/matches/${encodeURIComponent(sportId)}/popular`,
    "MATCHES_UNAVAILABLE"
  );
  return data.matches;
}

export async function fetchLiveMatches(): Promise<Match[]> {
  const data = await request<MatchesResponse>("/matches/live", "MATCHES_UNAVAILABLE");
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

const STREAM_SOURCES = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "intel", "admin"];

export interface AllMatchesResult {
  sportId: string;
  sportName: string;
  matches: Match[];
}

export async function fetchAllMatches(): Promise<AllMatchesResult[]> {
  const sports = await fetchSports();
  const results = await Promise.all(
    sports.map(async (s) => {
      try {
        const matches = await fetchMatchesBySport(s.id);
        return { sportId: s.id, sportName: s.name, matches };
      } catch {
        return { sportId: s.id, sportName: s.name, matches: [] };
      }
    })
  );
  return results;
}

export async function fetchStreams(source: string, sourceId: string): Promise<Stream[]> {
  if (!API_BASE || !STREAM_SOURCES.includes(source)) return [];
  try {
    return await request<Stream[]>(
      `/stream/${encodeURIComponent(source)}/${encodeURIComponent(sourceId)}`,
      "STREAMS_UNAVAILABLE"
    );
  } catch {
    return [];
  }
}

export function posterUrl(path: string | undefined): string | undefined {
  if (!path || !API_BASE) return undefined;
  return `${API_BASE.replace(/\/api$/, "")}${path}`;
}

export function badgeUrl(id: string | undefined): string | undefined {
  if (!id || !API_BASE) return undefined;
  return `${API_BASE}/images/badge/${id}.webp`;
}
