import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const VALID_API_KEYS = [
  process.env.DESKTOP_API_KEY,
  process.env.DESKTOP_API_KEY_SECONDARY,
].filter(Boolean);

/**
 * Ellenőrzi az API kulcsot a request headerben
 * @param req - NextRequest objektum
 * @returns null ha érvényes, NextResponse ha hibás
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  const apiKey = req.headers.get("X-API-Key");

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "API kulcs hiányzik." },
      { status: 401 }
    );
  }

  if (!VALID_API_KEYS.includes(apiKey)) {
    console.warn("[API Auth] Invalid API key attempt:", apiKey.substring(0, 8) + "...");
    return NextResponse.json(
      { success: false, error: "Érvénytelen API kulcs." },
      { status: 403 }
    );
  }

  return null;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

export function checkRateLimit(req: NextRequest): NextResponse | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  const clientId = req.headers.get("X-API-Key") || ip;
  const now = Date.now();

  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
    return NextResponse.json(
      { success: false, error: "Túl sok kérés. Próbáld újra később." },
      {
        status: 429,
        headers: { "Retry-After": retryAfter.toString() },
      }
    );
  }

  clientData.count++;
  return null;
}

/**
 * Ellenőrzi a bejövő kérést alap szinten (rate limit + API kulcs ha nincs session)
 * Nem ellenőrzi, hogy a body-ban érkező email/licence megegyezik-e a sessionnel —
 * ezt az egyes route-oknak kell ellenőrizniük a `getSessionFromRequest` használatával.
 */
export async function validateRequest(req: NextRequest): Promise<NextResponse | null> {
  const rateLimitError = checkRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Van session token — engedjük tovább, részletes egyezést az egyes route-ok ellenőrzik
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ success: false, error: "Érvénytelen bejelentkezés." }, { status: 401 });
    }
    return null;
  }

  // Ha nincs session, kötelező az API kulcs
  const authError = validateApiKey(req);
  if (authError) return authError;

  return null;
}

/**
 * Visszaadja a next-auth JWT tokenjét (ha van), különböző route-ok ellenőrzésére
 */
export async function getSessionFromRequest(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return token || null;
  } catch (e) {
    console.error('[API Auth] getSessionFromRequest error:', e);
    return null;
  }
}
