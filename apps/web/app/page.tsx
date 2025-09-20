'use client'
 
import {useQuery,Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import {api} from "@workspace/backend/_generated/api";
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

function Page() {
  const usersList =useQuery(api.users.getAllUsers);
  const addUser = useMutation(api.users.add);
  return(
    <>
   <Authenticated>
      <div>
        <p>app/web</p>
        <button onClick={async()=>{
          await addUser();
        }}>Add User</button>
        <p>{JSON.stringify(usersList)}</p>
      </div>
      <UserButton/>
   </Authenticated>
   <Unauthenticated>
     
        <p>Loading...</p>
        <SignInButton>Sign In!</SignInButton>
    
   </Unauthenticated>
   </>
  )
}
 
export default Page;