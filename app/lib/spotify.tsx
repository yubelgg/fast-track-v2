import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.access_token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user data: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    const user = {
      id: data.id,
      displayName: data.display_name,
      email: data.email,
      images: data.images,
      country: data.country,
      product: data.product,
    };
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function getUserPlaylists(access_token: string) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user playlists: ${response.status} ${errorText}`,
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw error;
  }
}

export async function getPlaylistTracks(
  access_token: string,
  playlistId: string,
) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch playlist tracks: ${response.status} ${errorText}`,
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
}
