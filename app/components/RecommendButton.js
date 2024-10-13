import { useState } from 'react';
import { getRecommendations } from '../utils/api';

const RecommendButton = ({ songId }) => {
    const [recommendations, setRecommendations] = useState([]);

    const handleClick = async () => {
        try {
            const recs = await getRecommendations(songId, 5);
            setRecommendations(recs);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Get Recommendations</button>
            {recommendations.length > 0 && (
                <ul>
                    {recommendations.map((rec) => (
                        <li key={rec}>{rec}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecommendButton;
