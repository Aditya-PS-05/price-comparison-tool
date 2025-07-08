import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export interface CreateUserData {
  name: string
  email: string
  password: string
  defaultCountry?: string
  defaultCurrency?: string
  timezone?: string
  language?: string
}

export interface UpdateUserData {
  name?: string
  defaultCountry?: string
  defaultCurrency?: string
  timezone?: string
  language?: string
}

export class UserService {
  static async createUser(data: CreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        defaultCountry: data.defaultCountry || 'US',
        defaultCurrency: data.defaultCurrency || 'USD',
        timezone: data.timezone || 'UTC',
        language: data.language || 'en',
      },
      select: {
        id: true,
        name: true,
        email: true,
        defaultCountry: true,
        defaultCurrency: true,
        timezone: true,
        language: true,
        createdAt: true,
      }
    })
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        defaultCountry: true,
        defaultCurrency: true,
        timezone: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        accounts: true,
        sessions: true,
      }
    })
  }

  static async updateUser(id: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        defaultCountry: true,
        defaultCurrency: true,
        timezone: true,
        language: true,
        updatedAt: true,
      }
    })
  }

  static async getUserStats(userId: string) {
    const [searchCount, savedProductCount, alertCount] = await Promise.all([
      prisma.search.count({ where: { userId } }),
      prisma.savedProduct.count({ where: { userId } }),
      prisma.priceAlert.count({ where: { userId, isActive: true } }),
    ])

    return {
      totalSearches: searchCount,
      savedProducts: savedProductCount,
      activeAlerts: alertCount,
    }
  }

  static async deleteUser(id: string) {
    // This will cascade delete all related records due to the schema
    return await prisma.user.delete({
      where: { id }
    })
  }
}