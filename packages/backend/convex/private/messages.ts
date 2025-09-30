import { ConvexError } from "convex/values";
import { components } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";
import {v} from "convex/values"
import { SupportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import {generateText} from "ai"
import { google } from "@ai-sdk/google";


export const enhanceResponce=action({
    args:{
        prompt:v.string(),
    },
    handler:async(context,args)=>{
         const identity=await context.auth.getUserIdentity();
        if(identity===null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found",
            })
        }
        const orgId=identity.orgId as string;
        if(!orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found",
            })
        }

        const response =await generateText({
            model:google("gemini-2.5-flash"),
            messages:[
                {
                    role:"system",
                    content: "Enhance the operator’s message into one single polished version that is professional, clear, and helpful while keeping the original intent and key information; do not provide multiple options, do not explain the changes, output only the enhanced text."
                },{
                    role:"user",
                    content:args.prompt,
                }
            ]
        })
        return response.text
    }
})

export const create =mutation({
    args:{
        prompt:v.string(),
        conversationId:v.id("conversations"),
    },
    handler: async(context, args)=>{
        const identity=await context.auth.getUserIdentity();
        if(identity===null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found",
            })
        }

        const orgId=identity.orgId as string;
        if(!orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found",
            })
        }

        const  conversation = await context.db.get(args.conversationId)

        if(!conversation){
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Coversation not found"
            })
        }
        if(conversation.organizationId!==orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message: "Invalid Organization ID"
            })
        }
        if(conversation.status === 'resolved'){
            throw new ConvexError({
                code: "BAD_REQUEST",
                message:    "Conversation resolved"
            })
        }

        if(conversation.status==="unresolved"){
            await context.db.patch(args.conversationId,{
                status:"escalated"
            })
        }

        await saveMessage(context,components.agent,{
            threadId:conversation.threadId,
            agentName:identity.familyName,
            message:{
                role:"assistant",
                content:args.prompt
            }
        });


    }
})


export const getMany=query({
    args:{
        threadId:v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async(context,args)=>{
        const identity=await context.auth.getUserIdentity();
        if(identity===null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found",
            })
        }

        const orgId=identity.orgId as string;
        if(!orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found",
            })
        }

        const conversation = await context.db
            .query("conversations")
            .withIndex("by_thread_id",(q)=>q.eq("threadId",args.threadId))
            .unique()

        if(!conversation){
            throw new ConvexError({
                code:"NOT_FOUND",
                message:"Conversation not found",
            })
        }

        if(conversation.organizationId!==orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message: "Invalid Organization ID"
            })
        }

        const pagination=await SupportAgent.listMessages(context,{
            threadId:args.threadId,
            paginationOpts: args.paginationOpts,
        });
        return pagination;
        
    }
})