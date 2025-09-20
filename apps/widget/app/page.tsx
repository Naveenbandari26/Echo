
'use client'
 
import { useQueries, useQuery } from 'convex/react';
import {api} from "@workspace/backend/_generated/api";
import { useMutation } from 'convex/react';

function Page() {
  const usersList =useQuery(api.users.getAllUsers);
  const addUser = useMutation(api.users.add);
  return(
   <div>
    <p>app/widget</p>
      <button onClick={async()=>{
        await addUser();
      }}>Add User</button>
    <p>{JSON.stringify(usersList)}</p>
    </div>
  )
}
 
export default Page;