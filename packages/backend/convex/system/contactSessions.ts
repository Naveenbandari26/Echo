import {v} from "convex/values"
import { internalQuery } from "../_generated/server"

export const getOne=internalQuery({
    args:{
        contactSessionId: v.id("contactSessions")
    },
    handler:async (context,args)=>{
        return await context.db.get(args.contactSessionId)
    }
})