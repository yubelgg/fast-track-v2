import json
import sys

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


def get_recommendations(song_id, top_n=5):
    # TODO: Implement recommendation logic
    # Content based recommendation
    # using audio features to get recommendations (acousticness, danceability, energy, etc.)
    return ["song1", "song2", "song3", "song4", "song5"]


if __name__ == "__main__":
    song_id = sys.argv[1]
    recommendations = get_recommendations(song_id)
    print(json.dumps(recommendations))
