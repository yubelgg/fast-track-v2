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
from pydantic import BaseModel, Field, validator
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
    top_n: int

    @validator('top_n')
    def validate_top_n(cls, v):
        if v <= 0:
            raise ValueError('top_n must be greater than 0')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "song_id": "spotify:track:123",
                "top_n": 5
            }
        }

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    """
    Generate top N song recommendations based on cosine similarity.
    """
    try:
        song_id = request.song_id
        top_n = request.top_n
        
        logger = logging.getLogger(__name__)
        logger.info(f"Received request for song ID: {song_id} with top_n: {top_n}")

        # Get all songs
        response = supabase.from_('songs').select('*').execute()
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="No songs found in database"
            )
        
        songs_data = pd.DataFrame(response.data)
        logger.info(f"Available song IDs in database: {songs_data['id'].tolist()}")
        logger.info(f"Total songs in database: {len(songs_data)}")

        # If the requested song isn't in our database, return random recommendations
        if song_id not in songs_data['id'].values:
            logger.warning(f"Song ID {song_id} not found in database. Available IDs: {songs_data['id'].tolist()}")
            random_songs = songs_data['id'].sample(n=min(top_n, len(songs_data))).tolist()
            return {"recommendations": random_songs}

        # Get numeric columns for similarity calculation
        numeric_columns = songs_data.select_dtypes(include=[np.number]).columns.tolist()
        
        # Get features for target song
        song_features = songs_data[songs_data['id'] == song_id][numeric_columns]

        # Calculate similarities
        similarities = cosine_similarity(song_features, songs_data[numeric_columns]).flatten()

        # Get top N similar songs (excluding the input song)
        similar_indices = similarities.argsort()[-top_n-1:-1][::-1]
        recommendations = songs_data.iloc[similar_indices]['id'].tolist()

        return {"recommendations": recommendations}

    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

@app.get("/all_song_ids", response_model=dict)
def get_all_song_ids():
    """
    Get all song IDs from the database.
    """
    songs_data = fetch_all_songs()
    song_ids = songs_data['id'].tolist()
    return {"song_ids": song_ids}

handler = Mangum(app)