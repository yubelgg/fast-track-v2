from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path
from mangum import Mangum
from pydantic import BaseModel
from typing import List
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fast-track-v2.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.getenv("VERCEL") != "1":
    env_path = Path(__file__).resolve().parent.parent.parent / ".env.local"
    load_dotenv(dotenv_path=env_path)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL or key is not set")

supabase: Client = create_client(supabase_url, supabase_key)

def fetch_all_songs() -> pd.DataFrame:
    """
    Fetch all songs from the songs table.
    """
    try:
        # Query the songs table to get all songs
        response = supabase.from_('songs').select('*').execute()

        if not response.data:
            raise Exception("No data returned from the songs table.")
        
        # Convert the response to a DataFrame
        songs_data = pd.DataFrame(response.data)
        return songs_data
    except Exception as e:
        print(f"Error fetching songs: {e}")
        raise

class RecommendationRequest(BaseModel):
    song_id: str
    top_n: int = 5

@app.post("/recommend", response_model=dict)
def get_recommendations(request: RecommendationRequest):
    """
    Generate top N song recommendations based on cosine similarity.
    """
    song_ids = request.song_ids
    top_n = request.top_n
        
    logger = logging.getLogger(__name__)
    logger.info(f"Received request for song IDs: {song_ids} with top_n: {top_n}")

    songs_data = fetch_all_songs()
    logger.info(f"Fetched {len(songs_data)} songs from the database.")
        
    missing_ids = [song_id for song_id in song_ids if song_id not in songs_data['id'].values]
    if missing_ids:
        available_ids = songs_data['id'].tolist()
        logger.warning(f"Song IDs {missing_ids} not found in the database. Available IDs: {available_ids}")
        raise HTTPException(
            status_code=404, 
            detail=f"Song IDs {missing_ids} not found in the database. Available IDs: {available_ids}"
        )

    # Ensure only numeric columns are used for similarity
    numeric_columns = songs_data.select_dtypes(include=[np.number]).columns.tolist()
        
    # Extract features for the target song
    song_features = songs_data[songs_data['id'] == song_id][numeric_columns]
        
    # Compute cosine similarity between the target song and all songs
    similarities = cosine_similarity(song_features, songs_data[numeric_columns]).flatten()
        
    # Get indices of top N similar songs (excluding the song itself)
    similar_indices = similarities.argsort()[-top_n-1:-1][::-1]
        
    # Retrieve the IDs of the top N similar songs
    similar_songs = songs_data.iloc[similar_indices]['id'].tolist()

    logger.info(f"Generated recommendations: {similar_songs}")
        
    return {"recommendations": similar_songs}

@app.get("/all_song_ids", response_model=dict)
def get_all_song_ids():
    """
    Get all song IDs from the database.
    """
    songs_data = fetch_all_songs()
    song_ids = songs_data['id'].tolist()
    return {"song_ids": song_ids}

handler = Mangum(app)