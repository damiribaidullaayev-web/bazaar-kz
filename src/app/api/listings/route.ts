import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 12;

    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        ...(category && { category: category as any }),
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        author: { select: { name: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.listing.count({
      where: { status: "ACTIVE" },
    });

    return NextResponse.json({ listings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, city, category } = body;

    if (!title || !description || !price || !city || !category) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseInt(price),
        city,
        category,
        images: [],
        authorId: user.id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}