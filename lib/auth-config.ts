import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, NextAuthOptions } from "next-auth";

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
    };
    accessToken?: string;
    error?: string;
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
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Set debug to false to prevent debug messages
  debug: false, 
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
              cache: "no-store",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data?.user) {
            throw new Error(data?.message || "Authentication failed");
          }

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
          throw new Error(err instanceof Error ? err.message : "Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day instead of 30 days for better security
  },
  // Disable automatic JWT refreshes to prevent API hammering
  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
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
      
      // Handle token refresh or validation here if needed
      if (trigger === "update") {
        try {
          // Optional: Validate token with your backend API
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/validate`, {
          //   headers: { Authorization: `Bearer ${token.accessToken}` },
          // });
          // 
          // if (!response.ok) {
          //   token.error = "TokenExpired";
          // }
        } catch (error) {
          console.error("Token validation failed:", error);
          // Don't set error here to avoid logout loops
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email || "";
        session.user.role = token.role || "";
        session.user.image = token.image || null;
        session.user.name = token.name || null;
        session.user.organization_id = token.organization_id || "";
        session.user.phone = token.phone || "";
        session.accessToken = token.accessToken;
        
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },
  events: {
    async signOut() {
      // Optional: call your backend to invalidate the token
      // This depends on your backend implementation
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
};
