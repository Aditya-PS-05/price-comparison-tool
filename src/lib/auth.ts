import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required')
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          // Check if user exists in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              defaultCountry: true,
              defaultCurrency: true,
            }
          })

          if (!user || !user.password) {
            console.log('User not found or no password:', credentials.email)
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('User authenticated successfully:', user.email)
          
          // Return user data without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            defaultCountry: user.defaultCountry,
            defaultCurrency: user.defaultCurrency,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn() {
      // This callback runs whenever a user signs in
      // For credentials, we handle it in the authorize function
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/dashboard"
    },
    async session({ session, token }) {
      // Include user ID and additional fields in session from JWT token
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.defaultCountry = token.defaultCountry as string || 'US'
        session.user.defaultCurrency = token.defaultCurrency as string || 'USD'
      }
      return session
    },
    async jwt({ token, user }) {
      // Called when user signs in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.defaultCountry = user.defaultCountry || 'US'
        token.defaultCurrency = user.defaultCurrency || 'USD'
      }
      return token
    },
  },
}