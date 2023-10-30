// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import {prisma} from '@/lib/prisma';
import {AuthOptions} from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

// @ts-ignore
// @ts-ignore
export const authOptions: AuthOptions = {
  providers: [CognitoProvider({
    clientId: process.env.COGNITO_CLIENT_ID!,
    clientSecret: process.env.COGNITO_CLIENT_SECRET!,
    issuer: process.env.COGNITO_ISSUER
  })],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET, //new secrets
  callbacks: {
    session: async ({ session, token }: { session: any, token: any }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
}

//ADDED COGNITO PROVIDER
export default authHandler;