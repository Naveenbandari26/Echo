import { openai } from "@ai-sdk/openai";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import  SupportAgent  from "../agents/supportAgent";
import rag from "../rag";
import { google } from "@ai-sdk/google";
// import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const search = createTool({
  description: "Search the knowledge base for relevant information to help answer user questions",
  args: z.object({
    query: z
      .string()
      .describe("The search query to find relevant information")
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversation.getThreadID,
      { threadId: ctx.threadId },
    );

    if (!conversation) {
      return "Conversation not found";
    }

    const orgId = conversation.organizationId;

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    const contextText = `Found results in ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(", ")}. Here is the context:\n\n${searchResult.text}`;

    const response = await generateText({
      messages: [
        {
          role: "system",
          content: "You interpret knowledge base search results and provide helpful, accurate answers to user questions",
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`
        }
      ],
      model: google.chat("gemini-2.5-flash"),
    });

    await SupportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });

    return response.text;
  },
});
