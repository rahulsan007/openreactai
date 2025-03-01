"use server";


import prisma from "@/lib/prisma";
import {
  getMainCodingPrompt,
  screenshotToCodePrompt,
  softwareArchitectPrompt,
} from "@/lib/prompts";
import { OpenAI } from "openai";
import { notFound } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY!,
  baseURL: process.env.LLM_BASE_URL!,
});

// ✅ Fix: Explicitly define types
export async function createChat(
  prompt: string,
  model: string,
  quality: string,
  screenshotUrl?: string
): Promise<{ chatId: string; lastMessageId: string }> {
  const chat = await prisma.chat.create({
    data: {
      model,
      quality,
      prompt,
      title: "",
      shadcn: true,
    },
  });

  // ✅ Fix: Ensure the title is properly handled
  async function fetchTitle(): Promise<string> {
    const responseForChatTitle = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a chatbot helping the user create a simple app or script. Your job is to create a succinct title (3-5 words) for the chat based on the user's initial prompt. Return only the title.",
        },
        { role: "user", content: prompt },
      ],
    });

    return responseForChatTitle.choices[0].message?.content ?? "Untitled Chat";
  }

  async function fetchTopExample(): Promise<string> {
    const findSimilarExamples = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "system",
          content: `Match the request to the most similar example. Reply with one of the following or "none":\n\n- landing page\n- blog app\n- quiz app\n- pomodoro timer`,
        },
        { role: "user", content: prompt },
      ],
    });

    return findSimilarExamples.choices[0].message?.content ?? "none";
  }

  const [title, mostSimilarExample] = await Promise.all([
    fetchTitle(),
    fetchTopExample(),
  ]);

  let fullScreenshotDescription: string | undefined;
  if (screenshotUrl) {
    const screenshotResponse = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-11b-vision-instruct:free",
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: screenshotToCodePrompt },
            {
              type: "image_url",
              image_url: { url: screenshotUrl },
            },
          ],
        },
      ],
    });

    fullScreenshotDescription =
      screenshotResponse.choices[0].message?.content ?? undefined;
  }

  let userMessage = prompt;
  if (quality === "high") {
    const initialRes = await openai.chat.completions.create({
      model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
      messages: [
        { role: "system", content: softwareArchitectPrompt },
        { role: "user", content: fullScreenshotDescription ? fullScreenshotDescription + prompt : prompt },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    userMessage = initialRes.choices[0].message?.content ?? prompt;
  } else if (fullScreenshotDescription) {
    userMessage = `${prompt} RECREATE THIS APP AS CLOSELY AS POSSIBLE: ${fullScreenshotDescription}`;
  }

  const newChat = await prisma.chat.update({
    where: { id: chat.id },
    data: {
      title,
      messages: {
        createMany: {
          data: [
            { role: "system", content: getMainCodingPrompt(mostSimilarExample), position: 0 },
            { role: "user", content: userMessage, position: 1 },
          ],
        },
      },
    },
    include: { messages: true },
  });

  const lastMessage = newChat.messages.sort((a, b) => a.position - b.position).at(-1);
  if (!lastMessage) throw new Error("No new message");

  return {
    chatId: chat.id,
    lastMessageId: lastMessage.id,
  };
}

// ✅ Fix: Explicitly define parameter types
export async function createMessage(
  chatId: string,
  text: string,
  role: "user" | "system" | "assistant"
): Promise<{ id: string; content: string; position: number; chatId: string; createdAt: Date; role: string }> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  if (!chat) notFound();

  const maxPosition = Math.max(...chat.messages.map((m) => m.position), 0); // Handle empty case

  return await prisma.message.create({
    data: { role, content: text, position: maxPosition + 1, chatId },
    select: { id: true, content: true, position: true, chatId: true, createdAt: true, role: true }, // Ensure createdAt and role are returned
  });
}
