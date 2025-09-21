import {mutation, query} from "./_generated/server";

export const getAllUsers =query({
    args:{},
    handler : async(context)=>{
        const users = await context.db.query("users").collect();
        return users;
    },
});

export const add=mutation({
    args:{},
    handler:async(context)=>{
        const identity = await context.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const orgId= identity.orgId as string;
        if(!orgId){
            throw new Error("Organization ID not found");
        }
        

        const user = await context.db.insert("users",{name:"Naveen"});
        return user;
    },
})