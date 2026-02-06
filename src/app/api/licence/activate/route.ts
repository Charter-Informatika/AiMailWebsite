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

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        licence: licenceKey,
      },
      select: { licenceActivated: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen email vagy licenckulcs." },
        { status: 404 }
      );
    }

    if (existingUser.licenceActivated) {
      return NextResponse.json(
        { success: false, error: "A licenc már aktiválva van." },
        { status: 400 }
      );
    }

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 90);

    const result = await prisma.user.updateMany({
      where: {
        email: email,
        licence: licenceKey,
      },
      data: {
        licenceActivated: true,
        trialEndDate: trialEndDate.toISOString().split('T')[0], 
      },
    });

    if (result.count > 0) {
      return NextResponse.json({ 
        success: true,
        trialEndDate: trialEndDate.toISOString().split('T')[0]
      });
    }

    return NextResponse.json(
      { success: false, error: "Aktiválás sikertelen." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[API] Licence activation error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
