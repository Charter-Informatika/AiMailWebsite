import { createReadStream } from "fs";
import path from "path";

export async function GET(req: Request) {
  const fileUrl = "https://github.com/Charter-Informatika/AiMail/releases/download/1.2.4/aimail-Setup-1.2.4.exe";
  return new Response(null, {
    status: 302,
    headers: {
      Location: fileUrl,
    },
  });
}