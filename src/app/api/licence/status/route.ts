import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = validateRequest(req);
  if (authError) return authError;

  try {
    const { email, licenceKey } = await req.json();

    if (!email || !licenceKey) {
      return NextResponse.json(
        { success: false, error: "Email és licenckulcs megadása kötelező." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
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
        { success: false, error: "Érvénytelen email vagy licenckulcs." },
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
    console.error("[API] Licence status error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
