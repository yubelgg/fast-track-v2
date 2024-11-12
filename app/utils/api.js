const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000'
  : 'https://your-production-api-url';

export const getRecommendations = async (songId, topN = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        song_id: songId,
        top_n: topN
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error; // Re-throw to handle in the component
  }
};