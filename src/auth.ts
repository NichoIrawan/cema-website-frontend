import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  LoginPayloadSchema,
  LoginResponseSchema,
  GoogleLoginResponseSchema,
} from "@/lib/schemas/auth.schema";

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
            const validatedFields = LoginPayloadSchema.safeParse(credentials);

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

          // Validate response using appropriate schema
          const responseSchema = credentials?.idToken
            ? GoogleLoginResponseSchema
            : LoginResponseSchema;

          const validatedResponse = responseSchema.safeParse(data);

          if (!validatedResponse.success) {
            console.log(
              "❌ Response validation failed:",
              validatedResponse.error
            );
            console.log("  Received data:", data);
            return null;
          }

          // Extract validated data
          const { user, token } = validatedResponse.data.data;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            accessToken: token,
          };
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
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profilePicture = user.profilePicture;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
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
