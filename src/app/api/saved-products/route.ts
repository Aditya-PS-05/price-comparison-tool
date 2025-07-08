import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const saveProductSchema = z.object({
  productName: z.string().min(1),
  currentPrice: z.number().positive(),
  currency: z.string().min(1),
  country: z.string().min(2).max(3),
  seller: z.string().min(1),
  productUrl: z.string().url(),
  imageUrl: z.string().url().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const savedProducts = await prisma.savedProduct.findMany({
      where: {
        userId: session.user.id,
        status: 'active'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      products: savedProducts,
      total: await prisma.savedProduct.count({
        where: { 
          userId: session.user.id,
          status: 'active'
        }
      })
    });

  } catch (error) {
    console.error('Saved products GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = saveProductSchema.parse(body);

    // Check if product is already saved
    const existingProduct = await prisma.savedProduct.findFirst({
      where: {
        userId: session.user.id,
        productUrl: validatedData.productUrl,
        status: 'active'
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product already saved' },
        { status: 409 }
      );
    }

    const savedProduct = await prisma.savedProduct.create({
      data: {
        userId: session.user.id,
        productName: validatedData.productName,
        currentPrice: validatedData.currentPrice,
        savedPrice: validatedData.currentPrice, // Initial saved price = current price
        currency: validatedData.currency,
        country: validatedData.country,
        seller: validatedData.seller,
        productUrl: validatedData.productUrl,
        imageUrl: validatedData.imageUrl
      }
    });

    return NextResponse.json(savedProduct, { status: 201 });

  } catch (error) {
    console.error('Saved products POST API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive
    const updatedProduct = await prisma.savedProduct.updateMany({
      where: {
        id: productId,
        userId: session.user.id
      },
      data: {
        status: 'inactive'
      }
    });

    if (updatedProduct.count === 0) {
      return NextResponse.json(
        { error: 'Product not found or not owned by user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Saved products DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}