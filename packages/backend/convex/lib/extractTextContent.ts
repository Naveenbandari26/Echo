import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  image: google.chat("gemini-2.5-flash"),
  pdf: google.chat("gemini-2.5-flash"),
  html: google.chat("gemini-2.5-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image: "Extract textual content or describe visual elements from the image. If it's a document, transcribe the text accurately. If not, provide a concise visual description.",
  pdf: "Extract and return the full text content from the PDF. Preserve structure (headings, paragraphs, bullet points) where possible.",
  html: "Convert HTML content to clean, readable markdown. Retain structure (headers, lists, links) but remove all HTML tags."
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  context: { storage: StorageActionWriter },
  args: ExtractTextContentArgs,
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  const url = await context.storage.getUrl(storageId);
  assert(url, "Failed to get storage URL");

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(context, storageId, bytes, mimeType);
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
};

async function extractTextFileContent(
  context: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer = 
    bytes || (await (await context.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining that you'll do so."
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
};



async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string,
): Promise<string> {
  const timeoutMs = 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await Promise.race([
      generateText({
        model: AI_MODELS.pdf,
        system: SYSTEM_PROMPTS.pdf,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `The PDF file is located at ${url}. Extract the text and return it.`,
              },
            ],
          },
        ],
        maxRetries: 2,
      }),
      new Promise<{ text: string }>((_, reject) =>
        setTimeout(() => reject(new Error("PDF processing timeout")), timeoutMs - 1000)
      ),
    ]);

    clearTimeout(timeoutId);
    return result.text;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error extracting PDF text:", error);
    return `[Error processing PDF: ${error instanceof Error ? error.message : "Unknown error"}]`;
  }
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }]
      },
    ],
  });

  return result.text;
};
