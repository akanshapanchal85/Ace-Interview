import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

enum callStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

type AgentProps = {
    userName: string;
    userId?: string;
    type?: string;
    status?: callStatus;
}

const Agent = ({userName, status = callStatus.INACTIVE}: AgentProps) => {
    const isSpeaking = true;
    const messages = [
        "Whats your name",
        "My Name is John Doe",
        "What is your favorite programming language?",
        "My favorite programming language is JavaScript",
    ]
    const lastMessageIndex = messages[messages.length - 1];


  return (
    <>
        <div className="call-view">
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover'/>
                    {isSpeaking && <div className="animate-speak"/>}
                </div>
                <h3>AI Interviewer</h3>
            </div>
            <div className="card-border">
                <div className="card-content">
                    <Image src="/user-avatar.png" alt="user-avater" width={540} height={540} className='rounded-full object-cover size-[120px]'/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length > 0 && (
            <div className='transcript-border'>
                <div className='transcript'>
                    <p key={lastMessageIndex} className={cn('transition-opacity duration-500 opacity-0', 'animate-fade-in opacity-100')}>
                        {lastMessageIndex}
                    </p>
                </div>
            </div>

        )}

        <div className="w-full flex justify-center">
             {/* CALL STATUS DEFINING IN ENUM */}
             {status !== callStatus.ACTIVE ? (
                <button className='relative btn-call'> 
                    <span
                        className={cn(
                            'absolute animate-ping rounded-full opacity-75',
                            status !== callStatus.CONNECTING && 'hidden'
                        )}
                    />
                    <span>                    
                        {status === callStatus.INACTIVE || status === callStatus.FINISHED ? 'Call' : '...'} 
                    </span>
                    
                </button>
             ): (
                <button className="btn-disconnect">End</button>
             )}
        </div>
    </>
  );
};

export default Agent;