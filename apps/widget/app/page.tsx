
'use client'
 
import { useQueries, useQuery } from 'convex/react';
import {api} from "@workspace/backend/_generated/api";

function Page() {
  const usersList =useQuery(api.users.getAllUsers);
  return(
   <div>
    <p>app/widget</p>
    <p>{JSON.stringify(usersList)}</p>
    </div>
  )
}
 
export default Page;