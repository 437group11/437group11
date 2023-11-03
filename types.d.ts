import type { DefaultUser } from 'next-auth';
import type { DefaultSession } from "next-auth";

// https://stackoverflow.com/a/75466129
declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
    spotifyToken: string;
  }
}