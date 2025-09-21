"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";

function Page() {
  const usersList = useQuery(api.users.getAllUsers);
  const addUser = useMutation(api.users.add);
  return (
    <>
      <div>
        <p>app/web</p>
        <button
          onClick={async () => {
            await addUser();
          }}
        >
          Add User
        </button>
        <OrganizationSwitcher hidePersonal/>
        <p>{JSON.stringify(usersList)}</p>
      </div>
      <UserButton />
    </>
  );
}

export default Page;
