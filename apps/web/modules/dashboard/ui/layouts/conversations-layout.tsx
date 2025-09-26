import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@workspace/ui/components/resizable"
import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout=({children}:{children:React.ReactNode;})=>{
    return(
        <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
            <ResizablePanel defualtsize={30} maxSize={30} minSize={20}>
                <ConversationsPanel/>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel className="h-full" defualtsize={70}>{children}</ResizablePanel>
        </ResizablePanelGroup>
    )
}