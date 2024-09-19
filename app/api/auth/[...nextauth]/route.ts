import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

const handler = NextAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public",
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    }),
  ],
});

export { handler as GET, handler as POST };
