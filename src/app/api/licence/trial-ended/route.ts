import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = validateRequest(req);
  if (authError) return authError;

  try {
    const { licenceKey } = await req.json();

    if (!licenceKey) {
      return NextResponse.json(
        { success: false, error: "Licenckulcs megadása kötelező." },
        { status: 400 }
      );
    }

    const result = await prisma.user.updateMany({
      where: {
        licence: licenceKey,
      },
      data: {
        trialEnded: true,
      },
    });

    if (result.count > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Licenc nem található." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[API] Trial ended update error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
