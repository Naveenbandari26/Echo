import { Button } from "@workspace/ui/components/button"
import { HomeIcon, InboxIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export const WidgetFooter=()=>{
    const screen = "selection"

    return (
        <footer className="flex items-center justify-around p-4 border-t bg-background">
            <Button 
                className="h-14 flex-1 rounded-none"
                onClick={()=>{}}
                variant="ghost"
                size="icon"
            >
                <HomeIcon 
                 className={cn(
                    "size-6",
                    screen==="selection" && "text-primary"
                 )}

                />
            </Button>

            <Button 
                className="h-14 flex-1 rounded-none"
                onClick={()=>{}}
                variant="ghost"
                size="icon"
            >
                <InboxIcon 
                 className={cn(
                    "size-6",
                    screen==="inbox" && "text-primary"
                 )}

                />
            </Button>


        </footer>
    )
}