import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest, getSessionFromRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = await validateRequest(req);
  if (authError) return authError;

  try {
    const { email, licenceKey } = await req.json();

    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Be kell jelentkezni a webes fiókkal.' }, { status: 401 });
    }

    if (session.email && session.email !== email && session.licence !== licenceKey) {
      return NextResponse.json({ success: false, error: 'A bejelentkezett fiók nem egyezik a lekérdezett licenccel.' }, { status: 403 });
    }

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
      select: { id: true },
    });

    if (user) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Hibás licenc vagy email." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[API] Licence check error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
