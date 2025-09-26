import { mutation, query } from "../_generated/server";
import {ConvexError, v} from "convex/values";
import { SupportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

import { paginationOptsValidator } from "convex/server";

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

export const getMany=query({
    args:{
        contactSessionId: v.id("contactSessions"),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (context,args)=>{

        const contactSession=await context.db.get(args.contactSessionId);
        if(!contactSession || contactSession.expiresAt<Date.now()){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid session",
            })
        }

        const conversations=await context.db
        .query("conversations")
        .withIndex("by_contact_session_id",(q)=>
            q.eq("contactSessionId",args.contactSessionId),
        )
        .order("desc")
        .paginate(args.paginationOpts);

        //getting last msg

        const conversationsWithLastMessage=await Promise.all(
            conversations.page.map(async (conversation)=>{
                let lastMessage:MessageDoc | null =null;
                const messages=await SupportAgent.listMessages(context,{
                    threadId:conversation.threadId,
                    paginationOpts:{numItems:1,cursor:null},
                });

                if(messages.page.length>0){
                    lastMessage=messages.page[0] ?? null
                }
                
                return {
                    _id:conversation._id,
                    _creationTime:conversation._creationTime,
                    status:conversation.status,
                    organizationId:conversation.organizationId,
                    threadId:conversation.threadId,
                    lastMessage,
                }
            })
        )

        return {
            ...conversations,
            page:conversationsWithLastMessage
        }

    }
})