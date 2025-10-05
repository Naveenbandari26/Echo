import { ConvexError } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, query } from "../_generated/server";
import { v } from "convex/values";
import  SupportAgent  from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { saveMessage } from "@convex-dev/agent";
import { search } from "../system/ai/tools/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (context, args) => {
    const contactSession = await context.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await context.runQuery(
      internal.system.conversation.getThreadID,
      {
        threadId: args.threadId,
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Coversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      });
    }

    //subscription check

    const shouldTriggerAgent=
        conversation.status==="unresolved"

    if(shouldTriggerAgent){
    await SupportAgent.generateText(
      context,
      { threadId: args.threadId },
      {
        prompt: args.prompt,
        tools: {
          resolveConversation,
          escalateConversation,
          search:search,
        },
      }
    );
    }
    else{
        await saveMessage(context,components.agent,{
            threadId:args.threadId,
            prompt:args.prompt,
        })
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (context, args) => {
    const contactSession = await context.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session",
      });
    }

    const pagination = await SupportAgent.listMessages(context, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    return pagination;
  },
});
