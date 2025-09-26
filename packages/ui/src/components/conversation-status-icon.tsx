import { ArrowRightIcon, ArrowUpIcon, CheckIcon} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface conversationStatusIconProps{
    status:"unresolved" | "escalated" | "resolved"
};

 const statusConfig={
        resolved:{
            icon:CheckIcon,
            bgColor:"bg-[#3FB62F]",
        },
        unresolved:{
            icon:ArrowRightIcon,
            bgColor:"bg-destructive",
        },
        escalated:{
            icon:ArrowUpIcon,
            bgColor:"bg-yellow-400"
        }

    } as const

export const ConversationStatusIcon=({
    status,
}:conversationStatusIconProps)=>{
    const config=statusConfig[status]
    const Icon=config.icon
    return (
        <div className={cn("flex items-center justify-center rounded-full p-1.5",config.bgColor)}>
            <Icon className="text-white size-4 stroke-3"/>
        </div>
    )
}
