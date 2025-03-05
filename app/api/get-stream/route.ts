import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY!,
  baseURL: process.env.LLM_BASE_URL!,
});

export async function POST(req: Request) {
  const { messageId, model } = await req.json();
  const prisma = getPrisma(); // Use getPrisma to get the Prisma client

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return new Response(null, { status: 404 });
  }

  const messagesRes = await prisma.message.findMany({
    where: { chatId: message.chatId, position: { lte: message.position } },
    orderBy: { position: "asc" },
  });

  let messages = z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .parse(messagesRes);

  if (messages.length > 10) {
    messages = [messages[0], messages[1], messages[2], ...messages.slice(-7)];
  }

  const res = await openai.chat.completions.create({
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
    temperature: 0.2,
    max_tokens: 9000,
  });

  return new Response(res.toReadableStream());
}

export const runtime = "edge";
export const maxDuration = 45;
