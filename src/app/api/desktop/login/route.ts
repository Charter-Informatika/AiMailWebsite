import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email és jelszó kötelező.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ success: false, error: 'Hibás adatok.' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Hibás adatok.' }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || process.env.SECRET || '';
    const token = jwt.sign({ email: user.email, licence: user.licence }, secret, { expiresIn: '30d' });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('[API] Desktop login error:', error);
    return NextResponse.json({ success: false, error: 'Szerver hiba.' }, { status: 500 });
  }
}
