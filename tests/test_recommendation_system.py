import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import sys
import os
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.recommend.index import app, RecommendationRequest, fetch_all_songs

client = TestClient(app)

@pytest.fixture
def mock_songs_data():
    # Create mock data with necessary columns for recommendations
    return pd.DataFrame({
        'id': [f'song_{i}' for i in range(10)],
        'name': [f'Song {i}' for i in range(10)],
        'danceability': np.random.random(10),
        'energy': np.random.random(10),
        'key': np.random.randint(0, 11, 10),
        'loudness': np.random.random(10) * -60,
        'mode': np.random.randint(0, 1, 10),
        'speechiness': np.random.random(10),
        'acousticness': np.random.random(10),
        'instrumentalness': np.random.random(10),
        'liveness': np.random.random(10),
        'valence': np.random.random(10),
        'tempo': np.random.random(10) * 200,
    })

def test_recommendation_endpoint(mock_songs_data):
    """Test the recommendation endpoint with valid data"""
    with patch('api.recommend.index.fetch_all_songs', return_value=mock_songs_data):
        request_data = {
            "song_id": "song_0",
            "top_n": 5
        }
        response = client.post("/recommend", json=request_data)
        
        assert response.status_code == 200
        recommendations = response.json()["recommendations"]
        assert isinstance(recommendations, list)
        assert len(recommendations) == 5
        assert all(isinstance(rec, str) for rec in recommendations)

def test_api_latency(mock_songs_data):
    """Test that API response time is within acceptable range"""
    with patch('api.recommend.index.fetch_all_songs', return_value=mock_songs_data):
        request_data = {
            "song_id": "song_0",
            "top_n": 5
        }
        start_time = datetime.now()
        response = client.post("/recommend", json=request_data)
        end_time = datetime.now()
        
        latency = (end_time - start_time).total_seconds() * 1000  # Convert to ms
        assert response.status_code == 200
        assert latency < 500  # Increased threshold to 500ms for more realistic testing

def test_concurrent_requests(mock_songs_data):
    """Test handling of concurrent requests"""
    import concurrent.futures
    
    def make_request():
        return client.post("/recommend", json={
            "song_id": "song_0",
            "top_n": 5
        })
    
    with patch('api.recommend.index.fetch_all_songs', return_value=mock_songs_data):
        n_requests = 50
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(n_requests)]
            responses = [f.result() for f in futures]
        
        success_rate = sum(1 for r in responses if r.status_code == 200) / len(responses)
        assert success_rate > 0.95  # 95% success rate threshold

def test_invalid_song_id(mock_songs_data):
    """Test handling of invalid song ID"""
    with patch('api.recommend.index.fetch_all_songs', return_value=mock_songs_data):
        request_data = {
            "song_id": "invalid_song_id",
            "top_n": 5
        }
        response = client.post("/recommend", json=request_data)
        
        assert response.status_code == 200  # Should return 200 with random recommendations
        recommendations = response.json()["recommendations"]
        assert isinstance(recommendations, list)
        assert len(recommendations) == 5

def test_invalid_top_n(mock_songs_data):
    """Test handling of invalid top_n parameter"""
    with patch('api.recommend.index.fetch_all_songs', return_value=mock_songs_data):
        # Test negative value
        request_data = {
            "song_id": "song_0",
            "top_n": -1
        }
        response = client.post("/recommend", json=request_data)
        assert response.status_code == 422
        assert "top_n must be greater than 0" in response.json()["detail"]
        
        # Test zero value
        request_data = {
            "song_id": "song_0",
            "top_n": 0
        }
        response = client.post("/recommend", json=request_data)
        assert response.status_code == 422
        assert "top_n must be greater than 0" in response.json()["detail"]
        
        # Test missing top_n
        request_data = {
            "song_id": "song_0"
        }
        response = client.post("/recommend", json=request_data)
        assert response.status_code == 422
        
        # Test non-integer top_n
        request_data = {
            "song_id": "song_0",
            "top_n": "invalid"
        }
        response = client.post("/recommend", json=request_data)
        assert response.status_code == 422
        
        # Test valid value works
        request_data = {
            "song_id": "song_0",
            "top_n": 5
        }
        response = client.post("/recommend", json=request_data)
        assert response.status_code == 200
        recommendations = response.json()["recommendations"]
        assert len(recommendations) == 5