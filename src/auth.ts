import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import authConfig from "@/auth.config"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          )

          if (passwordsMatch) return user
        }

        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserByEmail(token.email as string) // Or getUserById
      // Actually simpler to just add role to token if user exists
      // But getUserByEmail might not be efficient in JWT callback on every request if check needed
      // Using getUserById is safer with token.sub

      // For now, let's keep it simple. But I need role in session for Admin Dashboard
      if (!token.role && existingUser) {
        token.role = existingUser.role
      }

      return token
    }
  }
})
