import axios from 'axios';

const STREAMED_API = process.env.STREAMED_API || 'https://streamed.pk';

const validSources = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo',
  'foxtrot', 'golf', 'hotel', 'intel', 'admin',
];

export async function getStreamBySource(req, res) {
  const { source, id } = req.params;

  if (!validSources.includes(source)) {
    return res.status(400).json({
      error: 'Invalid source',
      message: `Source must be one of: ${validSources.join(', ')}`,
    });
  }

  try {
    const response = await axios.get(
      `${STREAMED_API}/api/stream/${source}/${id}`,
      { timeout: 5000 },
    );

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching stream from ${source}:`, error.message);
    res.status(502).json({
      error: 'Failed to fetch stream',
      message: `Unable to reach the ${source} stream source`,
    });
  }
}
