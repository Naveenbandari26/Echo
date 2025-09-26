'use client'


import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import WidgetHeader from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { isPageStatic } from "next/dist/build/utils";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen=()=>{

    const setScreen =useSetAtom(screenAtom);
    const setErrorMessage=useSetAtom(errorMessageAtom);
    const organizationId=useAtomValue(organizationIdAtom);
    const contactSessionId=useAtomValue(
        contactSessionIdAtomFamily(organizationId || ""),
    )
    const setConversationId=useSetAtom(conversationIdAtom);
    
    const createConversation=useMutation(api.public.conversations.create);
    const [isPending ,setIsPending] =useState(false);

    const handleNewConversation= async ()=>{
        if(!organizationId){
            setScreen("error")
            setErrorMessage("Organization ID us required")
            return 
        }
        if(!contactSessionId){
            setScreen("auth")
            return 
        }
        setIsPending(true);
        try{
            const coversationId=await createConversation({
                contactSessionId,
                organizationId
            })
            setConversationId(coversationId);
            setScreen("chat")
           }
        catch{
            setScreen("auth")
        }
        finally{
            setIsPending(false)
        }
    }

    return (
        <>
            <WidgetHeader className="">
                 <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className=" text-3xl">Hey there </p>
                    <p className="text-lg">Let&apos;s get you started!</p>
                </div>
            </WidgetHeader>

            <div className="flex flex-col flex-1 gap-y-4 p-4 overflow-y-auto">
               <Button className="h-16 w-full justify-between" variant="outline" onClick={handleNewConversation} disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4"/>
                        <span>Start chat</span>
                    </div>
                    <ChevronRightIcon/>
               </Button>

            </div>
            <WidgetFooter/>
        </>

    )
}
