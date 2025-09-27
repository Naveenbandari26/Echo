import {ConvexError, v} from "convex/values"
import { internalMutation, internalQuery } from "../_generated/server";
export const getThreadID =internalQuery({
    args:{
        threadId:v.string(),
    },
    handler:async(context,args)=>{
        const conversation= await context.db
        .query("conversations")
        .withIndex("by_thread_id", (q) => q.eq("threadId" ,args.threadId))
        .unique();

        return conversation;
        }
    })

export const resolve =internalMutation({
    args:{
        threadId:v.string(),
    },
    handler: async(context, args)=>{
        const conversation=await context.db
        .query("conversations")
        .withIndex("by_thread_id",(q)=>q.eq("threadId",args.threadId))
        .unique();

        if(!conversation){
            throw new ConvexError({
                code:"NOT_FOUND",
                message: "Conversation Not Found"
            })
        }

        await context.db.patch(conversation._id,{status:"resolved"});

    }
})

export const escalate =internalMutation({
    args:{
        threadId:v.string(),
    },
    handler: async(context, args)=>{
        const conversation=await context.db
        .query("conversations")
        .withIndex("by_thread_id",(q)=>q.eq("threadId",args.threadId))
        .unique();

        if(!conversation){
            throw new ConvexError({
                code:"NOT_FOUND",
                message: "Conversation Not Found"
            })
        }

        await context.db.patch(conversation._id,{status:"escalated"});

    }
})