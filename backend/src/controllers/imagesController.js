import axios from 'axios';

const STREAMED_API = process.env.STREAMED_API || 'https://streamed.pk';

export async function getAllImages(req, res) {
  try {
    const [sportsRes, eventsRes] = await Promise.all([
      axios.get(`${STREAMED_API}/api/sports`, { timeout: 5000 }).catch(() => ({ data: [] })),
      axios.get(`${STREAMED_API}/api/matches/all`, { timeout: 5000 }).catch(() => ({ data: [] })),
    ]);

    const sports = sportsRes.data || [];
    const events = eventsRes.data || [];

    const teamRequests = sports.map((sport) =>
      axios.get(`${STREAMED_API}/api/teams?sport_id=${sport.id}`, { timeout: 5000 })
        .then((r) => r.data || [])
        .catch(() => []),
    );

    const teamsData = await Promise.all(teamRequests);
    const teams = teamsData.flat();

    const badges = (teams || [])
      .filter((t) => t.badge)
      .map((t) => ({
        id: t.badge,
        team: t.name,
        sport: (sports.find((s) => s.id === t.sport_id) || {}).name || null,
        url: `/api/images/badge/${t.badge}.webp`,
      }));

    const posters = (events || [])
      .filter((e) => e.poster || (e.home_team?.badge && e.away_team?.badge))
      .map((e) => {
        const homeBadge = e.home_team?.badge;
        const awayBadge = e.away_team?.badge;
        return {
          id: e.id,
          title: e.title || e.name,
          poster: e.poster || `/api/images/poster/${homeBadge}/${awayBadge}.webp`,
          url: e.poster
            ? `/api/images/proxy/${encodeURIComponent(e.poster)}.webp`
            : `/api/images/poster/${homeBadge}/${awayBadge}.webp`,
        };
      });

    const uniqueBadges = [...new Map(badges.map((b) => [b.id, b])).values()];

    res.json({
      images: {
        badges: {
          count: uniqueBadges.length,
          items: uniqueBadges,
        },
        posters: {
          count: posters.length,
          items: posters,
        },
      },
      total: uniqueBadges.length + posters.length,
    });
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(502).json({
      error: 'Failed to fetch images data',
      message: 'Unable to reach the image data source',
    });
  }
}

export async function getBadgeImage(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.get(`${STREAMED_API}/api/images/badge/${id}.webp`, {
      responseType: 'stream',
      timeout: 10000,
    });
    res.set('Content-Type', response.headers['content-type'] || 'image/webp');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching badge image:', error.message);
    res.status(502).json({
      error: 'Failed to fetch badge image',
      message: 'Unable to reach the image data source',
    });
  }
}

export async function getPosterImage(req, res) {
  try {
    const { badge1, badge2 } = req.params;
    const response = await axios.get(`${STREAMED_API}/api/images/poster/${badge1}/${badge2}.webp`, {
      responseType: 'stream',
      timeout: 10000,
    });
    res.set('Content-Type', response.headers['content-type'] || 'image/webp');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching poster image:', error.message);
    res.status(502).json({
      error: 'Failed to fetch poster image',
      message: 'Unable to reach the image data source',
    });
  }
}

export async function getProxyImage(req, res) {
  try {
    const { poster } = req.params;
    const response = await axios.get(`${STREAMED_API}/api/images/proxy/${poster}.webp`, {
      responseType: 'stream',
      timeout: 10000,
    });
    res.set('Content-Type', response.headers['content-type'] || 'image/webp');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching proxied image:', error.message);
    res.status(502).json({
      error: 'Failed to fetch proxied image',
      message: 'Unable to reach the image data source',
    });
  }
}
