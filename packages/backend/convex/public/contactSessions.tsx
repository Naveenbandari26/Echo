import {v} from "convex/values";
import {mutation} from "../_generated/server"

const SESSION_DURATION_MS=1000*60*60*24; //1 day

export const create=mutation({
    args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      }))},
    handler:async(context,args)=>{
        const date=Date.now();
        const expiresAt=date+SESSION_DURATION_MS;
        const contactSessionId=await context.db.insert("contactSessions",{ 
            name:args.name,
            email:args.email,
            organizationId:args.organizationId,
            expiresAt,
            metadata:args.metadata
        });
        return contactSessionId;
    },
})