import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest, getSessionFromRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = await validateRequest(req);
  if (authError) return authError;

  try {
    const { licenceKey } = await req.json();

    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Be kell jelentkezni a webes fiókkal.' }, { status: 401 });
    }

    if (session.licence && session.licence !== licenceKey) {
      return NextResponse.json({ success: false, error: 'A bejelentkezett fiók nem egyezik a lekérdezett licenccel.' }, { status: 403 });
    }

    if (!licenceKey) {
      return NextResponse.json(
        { success: false, error: "Licenckulcs megadása kötelező." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        licence: licenceKey,
      },
      select: {
        licenceActivated: true,
        trialEndDate: true,
        remainingGenerations: true,
        trialEnded: true,
        emailInUse: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen licenckulcs." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        licenceActivated: user.licenceActivated,
        trialEndDate: user.trialEndDate,
        remainingGenerations: user.remainingGenerations,
        trialEnded: user.trialEnded,
        emailInUse: user.emailInUse,
      },
    });
  } catch (error) {
    console.error("[API] Licence status by key error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
