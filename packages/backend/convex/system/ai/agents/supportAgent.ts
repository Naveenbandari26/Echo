import {google} from "@ai-sdk/google";
import {Agent} from "@convex-dev/agent"
import {components} from "../../../_generated/api"

export const SupportAgent=new Agent(components.agent,{
    chat: google.chat("gemini-2.5-flash"),
    instructions:"YOur are the customer support agent"

})