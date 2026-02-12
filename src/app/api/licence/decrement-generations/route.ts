import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest, getSessionFromRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = await validateRequest(req);
  if (authError) return authError;

  try {
    const { email } = await req.json();

    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Be kell jelentkezni a webes fiókkal.' }, { status: 401 });
    }

    if (session.email && session.email !== email) {
      return NextResponse.json({ success: false, error: 'A bejelentkezett fiók nem egyezik a kért email címmel.' }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email megadása kötelező." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { remainingGenerations: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Felhasználó nem található." },
        { status: 404 }
      );
    }

    const newValue = Math.max(0, user.remainingGenerations - 1);

    await prisma.user.update({
      where: { email },
      data: { remainingGenerations: newValue },
    });

    return NextResponse.json({
      success: true,
      remainingGenerations: newValue,
    });
  } catch (error) {
    console.error("[API] Decrement generations error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
