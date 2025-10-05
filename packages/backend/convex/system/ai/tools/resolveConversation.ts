import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import  SupportAgent  from "../agents/supportAgent";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  args: z.object({}),
  handler: async (context) => {
    if (!context.threadId) {
      return "Missing thread ID";
    }

    await context.runMutation(internal.system.conversation.resolve, {
      threadId: context.threadId,
    });

    await SupportAgent.saveMessage(context, {
      threadId: context.threadId,
      message: {
        role: "assistant",
        content: "Conversation resolved.",
      }
    });

    return "Conversation resolved";
  },
});
