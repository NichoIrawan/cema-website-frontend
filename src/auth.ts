import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

// Validation schema for login credentials
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// Backend API base URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        idToken: { label: "Firebase Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          let endpoint = "";
          let body = {};
          
          if (credentials?.idToken) {
            // Google Sign-In flow
            endpoint = `${BACKEND_API_URL}/google-login`;
            body = { idToken: credentials.idToken };
          } else {
            const validatedFields = loginSchema.safeParse(credentials);
  
            if (!validatedFields.success) {
              console.log("❌ Validation failed:", validatedFields.error);
              return null;
            }

            endpoint = `${BACKEND_API_URL}/login`;
            body = validatedFields.data;
          }
          
          console.log("🔵 Calling backend:", `${endpoint}`);
          
          // Call backend login endpoint
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          console.log("🔵 Response status:", response.status, response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.log("❌ Response not OK:", errorText);
            return null;
          }

          const data = await response.json();
          console.log("🔵 Backend response:", JSON.stringify(data, null, 2));

          // Actual backend returns: { status: "success", token: "...", id: "...", role: "...", message: "..." }
          if (data.status === "success" && data.token && data.id) {
            return {
              id: data.id,
              name: data.name || data.email || "User", // Fallback if name not provided
              email: data.email || "",
              role: data.role,
              profilePicture: data.profilePicture,
              accessToken: data.token,
            };
          }

          console.log("❌ Response structure mismatch. Missing required fields.");
          console.log("  - status:", data.status);
          console.log("  - token:", data.token ? "exists" : "MISSING");
          console.log("  - id:", data.id ? "exists" : "MISSING");
          return null;
        } catch (error) {
          console.error("❌ Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user }) {

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profilePicture = user.profilePicture;
        token.accessToken = user.accessToken;
      }
      return token;
    },


    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profilePicture = token.profilePicture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);