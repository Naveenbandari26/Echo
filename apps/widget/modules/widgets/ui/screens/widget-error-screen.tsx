'use client'

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { errorMessageAtom } from "../../atoms/widget-atom";
import WidgetHeader from "../components/widget-header";

export const WidgetErrorScreen=()=>{
    const errorMessage=useAtomValue(errorMessageAtom);
    return (
        <>
            <WidgetHeader className="">
                 <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className=" text-3xl">Hey there </p>
                    <p className="text-lg">Let&apos;s get you started!</p>
                </div>
            </WidgetHeader>

            <div className="flex flex-col w-full h-full items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <AlertTriangleIcon/>
                <p  className="text-sm">{errorMessage || "Invalid configuration"}</p>

            </div>
        </>

    )
}
