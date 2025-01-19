"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Layout from "../components/Layout";
import SpeechRecorder from "../components/SpeechRecorder";
import ChatMessage from '../components/ChatMessage';
import Link from "next/link";
import Image from "next/image";

export default function ChatPage() {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: "da43eec4-0253-4950-b5fe-741236182249",
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <ChatContent />
        </DynamicContextProvider>
    );
}

function ChatContent() {
    const router = useRouter();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    
    useEffect(() => {
        const therapist = localStorage.getItem('selectedTherapist');
        if (!therapist) {
            router.push('/');
        } else {
            setSelectedTherapist(Number(therapist));
        }
    }, [router]);
    
    const handleToggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="min-h-screen bg-background">
            <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b border-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="TalkTuahTherapist"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                    priority
                                />
                                <span className="text-lg font-semibold text-white">TalkTuahTherapist</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                <div className="container mx-auto px-4 pb-4">
                    <motion.div 
                        className="max-w-3xl mx-auto w-full h-[calc(100vh-4rem)] flex flex-col"
                    >
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/therapist')}
                                className="group relative p-3 bg-gradient-to-r from-primary-600/80 to-primary-700/80 hover:from-primary-700/80 hover:to-primary-800/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10 text-xl">←</span>
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            className="flex-1 overflow-y-auto space-y-2 pb-24"
                        >
                            <AnimatePresence mode="wait">
                                {messages.map((message, index) => (
                                    <ChatMessage
                                        key={index}
                                        content={message.content}
                                        role={message.role}
                                        onToggleMute={handleToggleMute}
                                        isMuted={isMuted}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 bg-background">
                            <SpeechRecorder
                                selectedPersona={selectedTherapist}
                                messages={messages}
                                setMessages={setMessages}
                                isMuted={isMuted}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
} 