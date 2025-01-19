import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChatMessageProps {
    content: string;
    role: string;
    onToggleMute: (muted: boolean) => void;
    isMuted: boolean;
}

export default function ChatMessage({ content, role, onToggleMute, isMuted }: ChatMessageProps) {
    const handleMuteClick = () => {
        onToggleMute(!isMuted);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`relative group max-w-[80%] rounded-lg p-4 ${
                role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
            }`}>
                {role === 'assistant' && (
                    <button
                        onClick={handleMuteClick}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label={isMuted ? "Unmute therapist" : "Mute therapist"}
                    >
                        {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                )}
                <p>{content}</p>
            </div>
        </motion.div>
    );
} 