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
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            console.log("❌ Validation failed:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;

          console.log("🔵 Calling backend:", `${BACKEND_API_URL}/login`);

          // Call backend login endpoint
          const response = await fetch(`${BACKEND_API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
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
            console.log("✅ Login successful for user ID:", data.id);
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
    /**
     * JWT Callback: Persist backend accessToken in NextAuth JWT
     * This runs when the JWT is created or updated
     */
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profilePicture = user.profilePicture;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    /**
     * Session Callback: Expose user info to the session
     * IMPORTANT: We do NOT expose the accessToken to the client session
     * It stays in the JWT token which is httpOnly
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profilePicture = token.profilePicture as string;
        // Note: accessToken is NOT added to session.user to prevent client exposure
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
