import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import  SupportAgent  from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
// import { components } from "../_generated/api";

import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "../_generated/dataModel";

// export const create=mutation({
//     args:{
//         organizationId:v.string(),
//         contactSessionId:v.id("contactSessions"),
//     },
//     handler:async(context,args)=>{
//         const session=await context.db.get(args.contactSessionId);

//         if(!session || session.expiresAt<Date.now()){
//             throw new ConvexError({
//                 code:"UNAUTHORIZED",
//                 message:"Invalid session",
//             })
//         }

//         const {threadId}=await SupportAgent.createThread(context,{
//             userId:args.organizationId,
//         })

//         await saveMessage(context,components.agent,{
//             threadId,
//             message:{
//                 role:"assistant",
//                 //later modify
//                 content:"Hello , how can I help you today?"
//             }
//         });

//         const conversationId=await context.db.insert("conversations",{
//             contactSessionId:session._id,
//             status:"unresolved",
//             organizationId:args.organizationId,
//             threadId
//         })

//         return conversationId;
//     }
// })

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const conversation = await context.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "COnversation not found",
      });
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization Id",
      });
    }

    const contactSession = await context.db.get(conversation.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "COntact Session not found",
      });
    }

    return {
      ...conversation,
      contactSession,
    };
  },
});

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("escalated"),
        v.literal("resolved")
      )
    ),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    let conversations: PaginationResult<Doc<"conversations">>;

    if (args.status) {
      conversations = await context.db
        .query("conversations")
        .withIndex("by_status_and_organization_id", (q) =>
          q
            .eq("status", args.status as Doc<"conversations">["status"])
            .eq("organizationId", orgId)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      conversations = await context.db
        .query("conversations")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const conversationsWithAdditionalData = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;
        const contactSession = await context.db.get(
          conversation.contactSessionId
        );

        if (!contactSession) {
          return null;
        }

        const messages = await SupportAgent.listMessages(context, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          ...conversation,
          lastMessage,
          contactSession,
        };
      })
    );
    const valiedConversations = conversationsWithAdditionalData.filter(
      (conv): conv is NonNullable<typeof conv> => conv !== null
    );
    return {
      ...conversations,
      page: valiedConversations,
    };
  },
});

export const updateStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const conversation=await context.db.get(args.conversationId);
    
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "COnversation not found",
      });
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization Id",
      });
    }

    await context.db.patch(args.conversationId,{status:args.status})
    

  },
});
