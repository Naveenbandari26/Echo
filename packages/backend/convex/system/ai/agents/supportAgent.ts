import {google} from "@ai-sdk/google";
import {Agent} from "@convex-dev/agent"
import {components} from "../../../_generated/api"
const SupportAgent=new Agent(components.agent,{
    chat: google.chat("gemini-2.5-flash"),
    instructions:`Your are the customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user express frustation, or requests a human explicitly.`,
    
})

export default SupportAgent