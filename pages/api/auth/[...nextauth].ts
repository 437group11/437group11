import NextAuth from "next-auth"
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
        // https://github.com/t3-oss/create-t3-app/issues/176
        async session({ session, user }: {session: any, user: any}) {
          session.user.id = user.id;
          session.spotifyToken = await requestSpotifyAccessToken()
          return Promise.resolve(session);
        },
      }
}

export default NextAuth(authOptions)

async function requestSpotifyAccessToken(): Promise<string> {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', process.env.SPOTIFY_CLIENT_ID!);
    data.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET!);
    
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
    });
    if (response.ok) {
        const json = await response.json();
        const token = json.access_token;
        if (token){
            return token;
        } else {
            console.error('token not received');
        }
    } else {
        console.error('request invalid');
    }
    return Promise.reject();
}