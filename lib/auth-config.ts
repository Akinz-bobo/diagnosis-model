import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      organization_id?: string;
      phone?: string;
      // ...any other fields
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    organization_id?: string;
    phone?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    organization_id?: string;
    phone?: string;
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data?.user) return null;

          return {
            id: data.user.id,
            name: data.user.full_name,
            email: data.user.email,
            image: data.user.image,
            role: data.user.role,
            accessToken: data.access_token,
            organization_id: data.user.organization_id,
            phone: data.user.phone,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.organization_id = user.organization_id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id!;
        session.user.email = token.email!;
        session.user.role = token.role!;
        session.user.image = token.image!;
        session.user.name = token.name;
        session.user.organization_id = token.organization_id;
        session.user.phone = token.phone;
        // ...add any other fields
        session.accessToken = token.accessToken!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
