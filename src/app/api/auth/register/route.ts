import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/db/users'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  defaultCountry: z.string().optional(),
  defaultCurrency: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log('Register endpoint called')
    
    // Check content type
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      console.log('Invalid content type:', contentType)
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('Request body received:', Object.keys(body))
    
    const validatedData = registerSchema.parse(body)
    console.log('Data validated successfully')
    
    const { name, email, password, defaultCountry, defaultCurrency } = validatedData

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email)

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await UserService.createUser({
      name,
      email,
      password,
      defaultCountry,
      defaultCurrency,
    })

    console.log('User created successfully:', user.email)
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof SyntaxError) {
      console.log('JSON parsing error:', error.message)
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}