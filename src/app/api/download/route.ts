import { createReadStream } from "fs";
import path from "path";

export async function GET(req: Request) {
  const fileUrl = "https://github.com/Charter-Informatika/AiMail/releases/download/2.2.0/aimail-Setup-2.2.0.exe";
  return new Response(null, {
    status: 302,
    headers: {
      Location: fileUrl,
    },
  });
}