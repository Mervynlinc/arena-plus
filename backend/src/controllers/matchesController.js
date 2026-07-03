import axios from 'axios';

const STREAMED_API = process.env.STREAMED_API || 'https://streamed.pk';

async function proxyMatches(path, req, res, errorLabel) {
  try {
    const response = await axios.get(`${STREAMED_API}/api/matches/${path}`, { timeout: 5000 });
    const matches = Array.isArray(response.data) ? response.data : [];
    res.json({ matches, total: matches.length });
  } catch (error) {
    console.error(`Error fetching ${errorLabel}:`, error.message);
    res.status(502).json({
      error: `Failed to fetch ${errorLabel}`,
      message: 'Unable to reach the matches data source',
    });
  }
}

export async function getAllMatches(req, res) {
  await proxyMatches('all', req, res, 'all matches');
}

export async function getPopularAllMatches(req, res) {
  await proxyMatches('all/popular', req, res, 'popular matches');
}

export async function getTodaysMatches(req, res) {
  await proxyMatches('all-today', req, res, "today's matches");
}

export async function getPopularTodaysMatches(req, res) {
  await proxyMatches('all-today/popular', req, res, "popular today's matches");
}

export async function getLiveMatches(req, res) {
  await proxyMatches('live', req, res, 'live matches');
}

export async function getPopularLiveMatches(req, res) {
  await proxyMatches('live/popular', req, res, 'popular live matches');
}

export async function getMatchesBySport(req, res) {
  const { sport } = req.params;
  await proxyMatches(sport, req, res, `matches for '${sport}'`);
}

export async function getPopularMatchesBySport(req, res) {
  const { sport } = req.params;
  await proxyMatches(`${sport}/popular`, req, res, `popular matches for '${sport}'`);
}
