import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "mock_facebook_id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "mock_facebook_secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { role: true }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName ? `${user.firstName} ${user.lastName}` : "User",
          role: user.role?.name || "Customer"
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) return false;
        
        const existingUser = await db.user.findUnique({ where: { email: user.email } });
        
        if (!existingUser) {
          const names = (user.name || "User").split(" ");
          await db.user.create({
            data: {
              email: user.email,
              firstName: names[0],
              lastName: names.length > 1 ? names.slice(1).join(" ") : "",
              isActive: true,
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        
        if (account?.provider === "google" || account?.provider === "facebook") {
          const dbUser = await db.user.findUnique({ where: { email: user.email as string }, include: { role: true } });
          if (dbUser) {
            token.role = dbUser.role?.name || "Customer";
            token.id = dbUser.id;
          }
        } else {
          token.role = (user as any).role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only",
};
