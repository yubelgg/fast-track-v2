import { Buffer } from "buffer";
import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string
    error?: "RefreshTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token?: string
    error?: "RefreshTokenError"
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // first time login
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        } as JWT;
      } else if (Date.now() < token.expires_at * 1000) {
        // Return previous token if the access token has not expired yet
        return token;
      } else {
        if (!token.refresh_token) {
          throw new TypeError("Missing refresh token");
        }
        try {
          const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
              "Authorization": `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
          });
          const tokensOrError = await response.json()

          if (!response.ok) throw tokensOrError

          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }

          token.access_token = newTokens.access_token
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          )
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token
          return token
        } catch (error) {
          console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError"
          return token
        }
      }
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.error = token.error;
      return session;
    },
  },
  debug: true,
};

const basicAuth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
