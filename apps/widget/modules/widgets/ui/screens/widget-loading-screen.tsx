'use client'

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom";
import WidgetHeader from "../components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep= "org" | "session" | "settings" | "vapi" | "done"

export const WidgetLoadingScreen=({organizationId}:{organizationId:string|null})=>{
    const [step,setStep]= useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);
    const loadingMessage=useAtomValue(loadingMessageAtom);
    const setOrganizationId=useSetAtom(organizationIdAtom);
    const setLoadingMessage=useSetAtom(loadingMessageAtom);
    const setErrorMessage=useSetAtom(errorMessageAtom);
    const setScreen=useSetAtom(screenAtom);

    const contactSessionId=useAtomValue(contactSessionIdAtomFamily(organizationId || ""));


    //step 1 : validate organization
    const validateOrganization=useAction(api.public.organizations.validate);
    useEffect(()=>{ 
        if(step !=="org"){
            return;
        }
        setLoadingMessage("Finding Organization ID..");
        if(!organizationId){
            setErrorMessage("Organization Id is required");
            setScreen("error")
            return 
        }
        setLoadingMessage("Verifying Organization...")
        console.log('loading')
        validateOrganization({organizationId:organizationId}).then((result)=>{
            if(result.valid){
                setOrganizationId(organizationId);
                setStep("session")
            }
            else{
                setErrorMessage(result.reason || " Invalid Configuration")
                setScreen("error")
            }
        })
        .catch(()=>{
            setErrorMessage("Unable to verify organization");
            setScreen("error")
        })

    },[step, organizationId,setErrorMessage,setScreen,setOrganizationId,setStep,validateOrganization,setLoadingMessage])

    // step-2: validate session (if exists)
    const validateContactSession=useMutation(api.public.contactSessions.validate);

    useEffect(()=>{
        if(step!=="session"){
            return ;
        }
        setLoadingMessage("Finding Contact Session Id..");

        
        if(!contactSessionId){
            setSessionValid(false);
            setStep("done");
            return ;
        }
        console.log("hello")
        setLoadingMessage("Validating Session ..")

        validateContactSession({contactSessionId:contactSessionId}).then((result)=>{
            setSessionValid(result.valid);
            setStep("done");
        })
        .catch(()=>{
            setSessionValid(false);
            setStep("done");
        })

    },[setStep,setSessionValid,setLoadingMessage,validateContactSession,contactSessionId])

    useEffect(()=>{
        if(step!=="done"){
            return 
        }
        const hasValidSession=contactSessionId && sessionValid;

        setScreen(hasValidSession ? "selection":"auth");
    },[setStep,setScreen,contactSessionId,sessionValid])


    return (
        <>
            <WidgetHeader className="">
                 <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className=" text-3xl">Hey there </p>
                    <p className="text-lg">Let&apos;s get you started!</p>
                </div>
            </WidgetHeader>

            <div className="flex flex-col w-full h-full items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <LoaderIcon className="animate-spin"/>
                <p  className="text-sm">{loadingMessage || "Loading..."}</p>

            </div>
        </>

    )
}
