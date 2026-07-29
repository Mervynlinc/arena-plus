import axios from 'axios';

const STREAMED_API = process.env.STREAMED_API || 'https://streamed.pk';

export async function getSports(req, res) {
  try {
    const { search } = req.query;

    const response = await axios.get(`${STREAMED_API}/api/sports`, {
      timeout: 5000,
    });

    let sports = response.data;

    if (search) {
      const query = search.toLowerCase();
      sports = sports.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query),
      );
    }

    res.json({ sports, total: sports.length });
  } catch (error) {
    console.error('Error fetching sports:', error.message);
    res.status(502).json({
      error: 'Failed to fetch sports data',
      message: 'Unable to reach the sports data source',
    });
  }
}

export async function getSportById(req, res) {
  try {
    const { id } = req.params;

    const response = await axios.get(`${STREAMED_API}/api/sports`, {
      timeout: 5000,
    });

    const sport = response.data.find((s) => s.id === id);

    if (!sport) {
      return res.status(404).json({ error: `Sport '${id}' not found` });
    }

    res.json(sport);
  } catch (error) {
    console.error('Error fetching sport:', error.message);
    res.status(502).json({
      error: 'Failed to fetch sport data',
      message: 'Unable to reach the sports data source',
    });
  }
}

export async function getSportLeagues(req, res) {
  try {
    const { id } = req.params;

    const response = await axios.get(`${STREAMED_API}/api/sports`, {
      timeout: 5000,
    });

    const sport = response.data.find((s) => s.id === id);

    if (!sport) {
      return res.status(404).json({ error: `Sport '${id}' not found` });
    }

    const leaguesResponse = await axios.get(
      `${STREAMED_API}/api/leagues?sport_id=${id}`,
      { timeout: 5000 },
    );

    res.json({
      sport: { id: sport.id, name: sport.name },
      leagues: leaguesResponse.data,
      total: Array.isArray(leaguesResponse.data) ? leaguesResponse.data.length : 0,
    });
  } catch (error) {
    console.error('Error fetching sport leagues:', error.message);
    res.status(502).json({
      error: 'Failed to fetch leagues',
      message: 'Unable to reach the leagues data source',
    });
  }
}

export async function getSportTeams(req, res) {
  try {
    const { id } = req.params;

    const response = await axios.get(`${STREAMED_API}/api/sports`, {
      timeout: 5000,
    });

    const sport = response.data.find((s) => s.id === id);

    if (!sport) {
      return res.status(404).json({ error: `Sport '${id}' not found` });
    }

    const teamsResponse = await axios.get(
      `${STREAMED_API}/api/teams?sport_id=${id}`,
      { timeout: 5000 },
    );

    res.json({
      sport: { id: sport.id, name: sport.name },
      teams: teamsResponse.data,
      total: Array.isArray(teamsResponse.data) ? teamsResponse.data.length : 0,
    });
  } catch (error) {
    console.error('Error fetching sport teams:', error.message);
    res.status(502).json({
      error: 'Failed to fetch teams',
      message: 'Unable to reach the teams data source',
    });
  }
}
