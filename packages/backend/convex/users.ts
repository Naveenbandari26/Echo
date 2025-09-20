import {query} from "./_generated/server";

export const getAllUsers =query({
    args:{},
    handler : async(context)=>{
        const users = await context.db.query("users").collect();
        return users;
    },
});