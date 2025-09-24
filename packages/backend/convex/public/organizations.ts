import { createClerkClient } from "@clerk/backend";

import {v} from "convex/values";
import { action } from "../_generated/server";

const creatClient =createClerkClient({
    secretKey:process.env.CLERK_SECRET_KEY || "",
})

export const validate=action({
    args:{
        organizationId:v.string(),
    },
    handler: async(context, args)=>{
        try{
            console.log("trying")
                await creatClient.organizations.getOrganization({organizationId:args.organizationId});
                console.log("done")
                return {valid:true};
        }
        catch{
                return {valid:false,reason:"Organization not found"};
        }

    }
})