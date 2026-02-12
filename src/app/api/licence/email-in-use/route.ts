import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest, getSessionFromRequest } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const authError = await validateRequest(req);
  if (authError) return authError;

  try {
    const { activationEmail, emailInUse } = await req.json();

    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Be kell jelentkezni a webes fiókkal.' }, { status: 401 });
    }

    if (session.email && session.email !== activationEmail) {
      return NextResponse.json({ success: false, error: 'A bejelentkezett fiók nem egyezik az activationEmail mezővel.' }, { status: 403 });
    }

    if (!activationEmail || !emailInUse) {
      return NextResponse.json(
        { success: false, error: "activationEmail és emailInUse megadása kötelező." },
        { status: 400 }
      );
    }

    const result = await prisma.user.updateMany({
      where: { email: activationEmail },
      data: { emailInUse },
    });

    if (result.count > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Felhasználó nem található." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[API] Email in use update error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await validateRequest(req);
  if (authError) return authError;

  try {
    const { activationEmail } = await req.json();

    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Be kell jelentkezni a webes fiókkal.' }, { status: 401 });
    }

    if (session.email && session.email !== activationEmail) {
      return NextResponse.json({ success: false, error: 'A bejelentkezett fiók nem egyezik az activationEmail mezővel.' }, { status: 403 });
    }

    if (!activationEmail) {
      return NextResponse.json(
        { success: false, error: "activationEmail megadása kötelező." },
        { status: 400 }
      );
    }

    const result = await prisma.user.updateMany({
      where: { email: activationEmail },
      data: { emailInUse: null },
    });

    if (result.count > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Felhasználó nem található." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[API] Clear email in use error:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba." },
      { status: 500 }
    );
  }
}
