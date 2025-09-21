import Vapi from "@vapi-ai/web";
import { set } from "mongoose";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    const vapiInstance = new Vapi("3169de79-6f8d-4deb-9eab-658f2a4a347d");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });
    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });
    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });
    vapiInstance.on("error", (error) => {
      console.log("Error in Vapi connection", error);
      setIsConnecting(false);
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, content: message.transcript },
        ]);
      }
    });

    return ()=>{
        vapiInstance?.stop();
        }
  }, []);


  const startCall = () => {
        setIsConnecting(true);
        if(vapi){
            vapi.start("a3580a73-8e92-4a6c-a9cf-e598e5883279");
        }
    };

    const endCall=()=>{
        if(vapi){
            vapi.stop();
        }
    }

    return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall
}

};
