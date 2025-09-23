
// 'use client'
// import { useVapi } from '@/modules/widgets/hooks/use-vapi';
// import { Button } from '@workspace/ui/components/button';

// function Page() {
//   const {} = useVapi();
//   const {
//     isConnected,
//     isConnecting,
//     isSpeaking,
//     transcript,
//     startCall,
//     endCall
//   } =useVapi();;
//   return(
//    <div className='flex flex-col items-center justify-center min-h-svh max-w-md mx-auto w-full'>
//     <p>app/widget</p>
//       <Button onClick={()=>startCall()}>Start call</Button>
//       <Button onClick={()=>endCall() } variant="destructive">End call</Button>
//       <p>isConnected: {isConnected}</p>
//       <p>isConnecting: {isConnecting}</p>
//       <p>isSpeaking:{isSpeaking}</p>

//       <p> {JSON.stringify(transcript,null,2)}</p> 
//     </div>
//   )
// }
 
// export default Page;


"use client";

import WidgetView from "@/modules/widgets/ui/views/widget-view";
import { use } from "react";

interface Props{
  searchParams: Promise<
  {
    organizationId?: string;
  }>
}

const Page=({searchParams}:Props)=>{
  const {organizationId}=use(searchParams);
  return(
    <WidgetView organizationId={organizationId}/>
  )
}
export default Page;