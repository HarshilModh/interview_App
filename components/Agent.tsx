'use client';

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { toast } from "sonner";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ 
    userName, 
    userId, 
    type, 
    questions,      
    interviewId,    
    feedbackId      
}: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    // 1. Vapi Event Listeners
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: any) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript }
                setMessages((prev) => [...prev, newMessage as SavedMessage]);
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.error('Vapi Error:', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError)
        }
    }, []);

    // 2. Handle Call Ending (The Logic Split)
    useEffect(() => {
        const handleEndCall = async () => {
            if (type === 'generate') {
                // Generator Mode: Just go back to dashboard
                toast.success("Interview generated successfully!");
                router.push('/');
            } else {
                // Interview Mode: Save Feedback
                if (messages.length > 0) {
                    toast.info("Generating feedback... This may take a few seconds.");
                    
                    try {
                        const { success, feedbackId: id } = await createFeedback({
                            interviewId: interviewId!,
                            userId: userId!,
                            transcript: messages,
                            feedbackId,
                        });

                        if (success) {
                            toast.success("Feedback generated!");
                            router.push(`/interview/${interviewId}/feedback`);
                        } else {
                            toast.error("Failed to save feedback");
                            router.push('/');
                        }
                    } catch (error) {
                        console.error("Feedback error:", error);
                        toast.error("An error occurred while generating feedback");
                        router.push('/');
                    }
                } else {
                     // If user hung up immediately without speaking
                     router.push('/');
                }
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            handleEndCall();
        }
    }, [callStatus, type, router, messages, interviewId, userId, feedbackId]);

    // 3. Start the Call
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === 'generate') {
            // MODE A: Generator -> Uses the API-created Assistant ID
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!);
        } else {
            // MODE B: Interviewer -> Uses the 'interviewer' constant
            let formattedQuestions = "";
            if (questions && questions.length > 0) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            } else {
                formattedQuestions = "Ask me about my experience as a developer.";
            }

            await vapi.start(interviewer as any, {
                variableValues: {
                    questions: formattedQuestions,
                },
            });
        }
    }

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover" />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>{type === 'generate' ? "Interview Creator" : "AI Interviewer"}</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call" onClick={handleCall} disabled={callStatus === CallStatus.CONNECTING}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}
                        />
                        <span className="relative z-10">
                            {callStatus === CallStatus.CONNECTING ? 'Connecting...' : 'Start Call'}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End Call
                    </button>
                )}
            </div>
        </>
    )
}
export default Agent;