import { OpenAI } from "openai";
import { z } from "zod";
import {
  getMainCodingPrompt,
  screenshotToCodePrompt,
  softwareArchitectPrompt
} from "@/lib/prompts";

// Define request schema using Zod for validation
const RequestSchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  quality: z.enum(["high", "low"]).optional().default("low"),
  screenshot: z.string().optional(),
});

// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export async function POST(req: Request) {
  try {
    // Parse and validate incoming request
    const json = await req.json();
    const result = RequestSchema.safeParse(json);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error.format() }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { model, messages, quality, screenshot } = result.data;

    // Extract the last message as the main user request
    let enhancedPrompt = messages[messages.length - 1].content;

    // If a screenshot is provided, analyze it and modify the prompt
    if (screenshot) {
      const screenshotAnalysis = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: screenshotToCodePrompt },
          { role: "user", content: `Analyze this screenshot: ${screenshot}` }
        ],
        temperature: 0.2,
      });

      const analysis = screenshotAnalysis.choices[0].message?.content || "";
      enhancedPrompt = `${analysis}\n\nOriginal request: ${enhancedPrompt}`;
    }

    // If quality is set to high, perform an architectural planning step
    if (quality === "high") {
      const planningResponse = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: softwareArchitectPrompt },
          { role: "user", content: enhancedPrompt }
        ],
        temperature: 0.2,
      });

      const plan = planningResponse.choices[0].message?.content || "";
      enhancedPrompt = `${plan}\n\nImplement this plan: ${enhancedPrompt}`;
    }

    // Start final AI streaming response
    const completionStream = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: getMainCodingPrompt(enhancedPrompt) },
        ...messages.slice(0, -1), // Include previous messages except the last one (already used)
        { role: "user", content: enhancedPrompt + "\nReturn ONLY code, no marks or explanations." }
      ],
      temperature: 0.2,
      stream: true,
    });

    // Handle streaming response properly
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completionStream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(text);
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.close();
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" }
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Edge runtime for optimized performance
export const runtime = "edge";
