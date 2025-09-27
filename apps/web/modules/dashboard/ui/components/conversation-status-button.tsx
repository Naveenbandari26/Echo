import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {Hint} from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton=(
    {status,onClick,disabled}:{status: Doc<"conversations">["status"];onClick:()=>void;disabled:boolean}
)=>{
        if(status==="resolved"){
            return(
                <Hint text="Mark as Unresolved">
                    <Button onClick={onClick} disabled={disabled} size="sm" className="bg-gradient-to-b from-[#3fb62f] to-[#318d25] tezt-white hover:to-[#318d25]/90"><CheckIcon/>Resolved</Button>
                </Hint>
            )
        }
        if(status==="escalated"){
            return(
                <Hint text="Mark as resolved">
                    <Button onClick={onClick} disabled={disabled} size="sm" className="bg-gradient-to-b from-yellow-500 to-[#be8b00] tezt-white hover:to-[#be8b00]/90"><ArrowUpIcon/>Escalated</Button>
                </Hint>
            )
        }
        return (
            <Hint text="Mark as escalated">
                    <Button onClick={onClick} disabled={disabled} size="sm" variant="destructive"><ArrowRightIcon/>Unresolved</Button>
            </Hint>
        )
}