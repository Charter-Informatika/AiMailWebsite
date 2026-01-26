import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaDB";
import { generateUniqueLicence } from "@/lib/licence";

export async function POST(request: any) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const licence = await generateUniqueLicence();
  
  // Set trial end date to 14 days from now
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      licence,
      trialEndDate: trialEndDate.toISOString(),
    },
  });
  const { password: _pw, passwordResetToken, passwordResetTokenExp, ...safe } = created as any;
  return NextResponse.json(safe);
}
