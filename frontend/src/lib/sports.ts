export const SPORT_EMOJIS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  cricket: '🏏',
  'motor-sports': '🏎️',
  'american-football': '🏈',
  hockey: '🏒',
  baseball: '⚾',
  fight: '🥊',
  rugby: '🏉',
  golf: '⛳',
  billiards: '🎱',
  darts: '🎯',
  afl: '🏐',
  other: '🏅',
};

export function sportEmoji(sportId: string | undefined): string {
  return (sportId && SPORT_EMOJIS[sportId]) || '🏅';
}
