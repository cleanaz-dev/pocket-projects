import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma/config";
import bcrypt from "bcryptjs";



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid password");
        }

        // Return user object (NextAuth expects 'id', 'name', 'email')
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            // We pass these purely to read them in the callbacks below
            type: user.type, 
            familyId: user.familyId 
        };
      },
    }),
  ],
  callbacks: {
    // 1. Add custom fields to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = (user as any).type;
        token.familyId = (user as any).familyId;
      }
      return token;
    },
    // 2. Make custom fields available in the client-side session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).type = token.type;
        (session.user as any).familyId = token.familyId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Custom login page path
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };