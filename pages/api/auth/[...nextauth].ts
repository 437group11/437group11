import NextAuth, { Account, Profile, Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import SpotifyProvider from "next-auth/providers/spotify"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "utils/db"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user }: {user: User | undefined}) {
            // When the user is undefined, don't allow sign in.
            // This ensures that in the rest of the app, we can access session.user.
            if (!user) {
                return false
            }
            return true
        },
        // https://github.com/t3-oss/create-t3-app/issues/176
        async session({ session, user }: {session: Session, user: User}) {
            session.user.id = user.id;
            session.spotifyToken = await requestSpotifyAccessToken()
            return session
        },
      }
}

export default NextAuth(authOptions)

async function requestSpotifyAccessToken(): Promise<string> {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token'

    const data = new URLSearchParams()
    data.append('grant_type', 'client_credentials')
    data.append('client_id', process.env.SPOTIFY_CLIENT_ID!)
    data.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET!)
    
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
    })
    if (!response.ok) {
        throw new Error("Failed to get Spotify Token")
    }
    
    const json = await response.json()
    const token = json.access_token
    if (!token) {
        throw new Error("Spotify Token missing")
    }

    return token
}