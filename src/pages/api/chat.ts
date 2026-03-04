import type { APIRoute } from "astro";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  // Use the API key from environment variable
  apiKey: import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "No Google Gemini API key configured." }),
      { status: 500 },
    );
  }

  try {
    const rawBody = await request.text();
    const { messages } = rawBody ? JSON.parse(rawBody) : { messages: [] };

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages,
      system: `You are the AI assistant for Nguyen Luong Truong Vi (Iris Nikita)'s portfolio website. 
      Your persona is professional yet friendly, acting as a technical guide. 
      You know that Vi is a Full-stack Developer based in Ho Chi Minh City with 4+ years of experience.
      Vi specializes in building high-traffic applications, CDP platforms, and Zalo Mini Apps for major brands like Highlands Coffee, PNJ, Phuc Long, and Aristino.
      Core skills: React, NestJS, Node.js, Astro, System Design, UX/UI animations.
      Keep answers concise and helpful. Recommend contacting Vi if the user wants to hire or discuss projects (Email: nltruongvi@gmail.com).`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request.",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
};
