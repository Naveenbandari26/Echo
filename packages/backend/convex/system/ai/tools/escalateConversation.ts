import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import  SupportAgent  from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (context) => {
    if (!context.threadId) {
      return "Missing thread ID";
    }

    await context.runMutation(internal.system.conversation.escalate, {
      threadId: context.threadId,
    });

    await SupportAgent.saveMessage(context, {
      threadId: context.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to a human operator.",
      }
    });

    return "Conversation escalated to a human operator";
  },
});
