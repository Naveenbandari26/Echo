import { Button } from "@workspace/ui/components/button"
import { HomeIcon, InboxIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai"
import { screenAtom } from "../../atoms/widget-atom"

export const WidgetFooter=()=>{
    const screen =useAtomValue(screenAtom);
    const setScreen=useSetAtom(screenAtom);

    return (
        <footer className="flex items-center justify-around p-4 border-t bg-background">
            <Button 
                className="h-14 flex-1 rounded-none"
                onClick={()=>setScreen("selection")}
                variant="ghost"
                size="icon"
            >
                <span className="flex flex-col items-center">
                    <HomeIcon 
                 className={cn(
                    "size-6",
                    screen==="selection" && "text-primary"
                 )}/>
                 Home
                </span>
                 
                
            </Button>

            <Button 
                className="h-14 flex-1 rounded-none"
                onClick={()=>setScreen("inbox")}
                variant="ghost"
                size="icon"
            >
                <span className="flex flex-col items-center">
                    <InboxIcon 
                 className={cn(
                    "size-6",
                    screen==="inbox" && "text-primary"
                 )}

                />
                Inbox
                </span>
            </Button>


        </footer>
    )
}