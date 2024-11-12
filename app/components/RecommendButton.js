import { useState } from 'react';
import { getRecommendations } from '../utils/api';

const RecommendButton = ({ songId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const recs = await getRecommendations(songId, 5);
            setRecommendations(recs);
        } catch (error) {
            setError(error.message);
            console.error('Error getting recommendations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handleClick}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Loading...' : 'Get Recommendations'}
            </button>
            
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
            
            {recommendations.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Recommendations:</h3>
                    <ul className="space-y-2">
                        {recommendations.map((rec) => (
                            <li key={rec}>{rec}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecommendButton;
