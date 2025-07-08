// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      defaultCountry?: string
      defaultCurrency?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    defaultCountry?: string
    defaultCurrency?: string
    timezone?: string
    language?: string
    createdAt?: Date
    updatedAt?: Date
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}