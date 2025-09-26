import {v} from "convex/values"
import { internalQuery } from "../_generated/server";
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