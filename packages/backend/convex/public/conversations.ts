import { mutation, query } from "../_generated/server";
import {ConvexError, v} from "convex/values";
import { SupportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

export const create=mutation({
    args:{
        organizationId:v.string(),
        contactSessionId:v.id("contactSessions"),
    },
    handler:async(context,args)=>{
        const session=await context.db.get(args.contactSessionId);

        if(!session || session.expiresAt<Date.now()){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid session",
            })
        }

        const {threadId}=await SupportAgent.createThread(context,{
            userId:args.organizationId,
        })

        await saveMessage(context,components.agent,{
            threadId,
            message:{
                role:"assistant",
                //later modify 
                content:"Hello , how can I help you today?"
            }
        });

        const conversationId=await context.db.insert("conversations",{
            contactSessionId:session._id,
            status:"unresolved",
            organizationId:args.organizationId,
            threadId
        })

        return conversationId;
    }
})


export const getOne=query({
    args:{
         conversationId:v.id("conversations"),
        contactSessionId:v.id("contactSessions"),
    },
    handler: async(context,args)=>{
        const session=await context.db.get(args.contactSessionId);

        if(!session || session.expiresAt<Date.now()){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid session",
            })
        }

        const conversation= await context.db.get(args.conversationId);
        if(!conversation)
        {
            throw new ConvexError({
                code:"NOT_FOUND",
                message:"Conversation Not Found",
            })
        }

        if(conversation.contactSessionId!== session._id){
             throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Incorrect session",
            })
        }

        if(conversation.contactSessionId !== session._id){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Incorrect session",
            })
        }


        return{
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId
        }   
    }
})